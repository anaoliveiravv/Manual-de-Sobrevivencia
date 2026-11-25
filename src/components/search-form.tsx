import Form from "next/form";
import { ArrowRight, Search } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  action: "/buscar" | "/mapa";
  placeholder?: string;
  query?: string;
  label?: string;
  children?: ReactNode;
};

export function SearchForm({
  action, placeholder = "Busque uma sala, laboratório ou setor", query = "", label = "Buscar locais", children,
}: Props) {
  return <Form action={action} role="search" aria-label={label} className="search-form">
    <div className="search-box">
      <label>
        <Search size={21} aria-hidden="true" />
        <span className="sr-only">{label}</span>
        <input name="q" type="search" defaultValue={query} placeholder={placeholder} />
      </label>
      <button type="submit" aria-label={label} className="primary search-submit"><ArrowRight size={20} aria-hidden="true" /></button>
    </div>
    {children}
  </Form>;
}
