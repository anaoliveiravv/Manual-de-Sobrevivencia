"use client";

export function CategoryFilter({ value, options }: { value: string; options: [string, string][] }) {
  return <label className="field category-filter">Categoria
    <select name="categoria" defaultValue={value} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
      <option value="">Todas as categorias</option>
      {options.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
    </select>
  </label>;
}
