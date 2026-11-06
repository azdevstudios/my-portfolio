import { useEffect, useRef } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

export default function AdminDialog({
  title,
  children,
  onClose,
  busy = false,
  wide = false,
}) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="admin-dialog-title"
      className={`admin-dialog ${wide ? "admin-dialog-wide" : ""}`}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="admin-dialog-heading">
        <h2 id="admin-dialog-title">{title}</h2>
        <button
          type="button"
          className="admin-icon-button"
          disabled={busy}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <HiOutlineXMark size={20} aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
