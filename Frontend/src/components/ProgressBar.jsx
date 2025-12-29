export default function ProgressBar({ value = 0, indeterminate = false, label }) {
  return (
    <div className="progress-wrapper">
      {label && <span className="muted" style={{ fontSize: "0.85rem" }}>{label}</span>}
      <div className={`progress ${indeterminate ? "indeterminate" : ""}`} role="progressbar">
        <div
          className="progress-bar"
          style={{ width: indeterminate ? "50%" : `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

