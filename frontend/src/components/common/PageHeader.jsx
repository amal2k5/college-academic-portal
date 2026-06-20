function PageHeader({ title, buttonText, onButtonClick }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default PageHeader;