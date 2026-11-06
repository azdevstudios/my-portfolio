import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { prepareProjectImage } from "../src/lib/images.js";

const originals = Object.fromEntries(
  ["createImageBitmap", "document", "FileReader"].map((key) => [
    key,
    globalThis[key],
  ]),
);
afterEach(() => {
  for (const [key, value] of Object.entries(originals)) {
    if (value === undefined) delete globalThis[key];
    else globalThis[key] = value;
  }
});

function reader() {
  globalThis.FileReader = class {
    readAsDataURL(blob) {
      blob.arrayBuffer().then((bytes) => {
        this.result = `data:${blob.type};base64,${Buffer.from(bytes).toString("base64")}`;
        this.onload();
      });
    }
  };
}

test("large uploads are resized, converted and encoded before sending", async () => {
  reader();
  let closed = false;
  const canvas = {
    getContext: () => ({ drawImage() {} }),
    toBlob(callback, type) {
      callback(new Blob(["optimized"], { type }));
    },
  };
  globalThis.document = { createElement: () => canvas };
  globalThis.createImageBitmap = async () => ({
    width: 3200,
    height: 1800,
    close() {
      closed = true;
    },
  });
  const result = await prepareProjectImage(
    new File([new Uint8Array(3 * 1024 * 1024)], "cover.png", {
      type: "image/png",
    }),
  );
  assert.equal(canvas.width, 1600);
  assert.equal(canvas.height, 900);
  assert.equal(result.contentType, "image/webp");
  assert.equal(Buffer.from(result.data, "base64").toString(), "optimized");
  assert.equal(closed, true);
});

test("small originals remain usable when browser conversion is unavailable", async () => {
  reader();
  globalThis.createImageBitmap = async () => {
    throw new Error("Unavailable");
  };
  const result = await prepareProjectImage(
    new File(["original"], "cover.png", { type: "image/png" }),
  );
  assert.equal(result.contentType, "image/png");
  assert.equal(Buffer.from(result.data, "base64").toString(), "original");
});

test("oversized uncompressible files cannot be uploaded", async () => {
  globalThis.createImageBitmap = async () => {
    throw new Error("Unavailable");
  };
  await assert.rejects(
    prepareProjectImage(
      new File([new Uint8Array(3 * 1024 * 1024)], "cover.png", {
        type: "image/png",
      }),
    ),
    /still over 2 MB/,
  );
});

test("unsupported file types and inputs over 10 MB are rejected", async () => {
  await assert.rejects(
    prepareProjectImage(
      new File(["<svg/>"], "cover.svg", { type: "image/svg+xml" }),
    ),
    /PNG, JPG or WebP/,
  );
  await assert.rejects(
    prepareProjectImage(
      new File([new Uint8Array(11 * 1024 * 1024)], "cover.png", {
        type: "image/png",
      }),
    ),
    /under 10 MB/,
  );
});
