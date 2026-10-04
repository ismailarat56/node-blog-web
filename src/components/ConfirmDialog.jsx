import { useEffect, useId, useRef } from "react";

export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <h2 id={titleId}>{title}</h2>

      {children}

      <div className="dialog__actions">
        <button
          type="button"
          className="button button--secondary"
          disabled={busy}
          onClick={onClose}
        >
          Vazgeç
        </button>
        <button
          type="button"
          className={danger ? "button button--danger" : "button"}
          disabled={busy}
          onClick={onConfirm}
        >
          {busy ? "Bekle..." : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
