/** Label + input/textarea/select + validation message, wired for accessibility. */
const FormField = ({ id, label, error, as: Tag = 'input', className = '', hint, ...props }) => (
  <div className={className}>
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <Tag
      id={id}
      className={`${Tag === 'select' ? 'form-select' : 'form-control'} ${error ? 'is-invalid' : ''}`}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
    {hint && !error && <div className="form-text">{hint}</div>}
    {error && (
      <div id={`${id}-error`} className="invalid-feedback">
        {error}
      </div>
    )}
  </div>
);

export default FormField;
