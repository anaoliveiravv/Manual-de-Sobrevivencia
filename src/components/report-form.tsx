"use client";

import { useState, type FormEvent } from "react";
import { CircleCheck } from "lucide-react";

const reportKey = "manual-ceuma:relato:v1";

export function ReportForm({ locations, selected }: { locations: { id: string; name: string }[]; selected: string }) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const description = String(data.get("descricao") ?? "").trim();
    if (!description) {
      setState("error");
      form.querySelector("textarea")?.focus();
      return;
    }

    try {
      localStorage.setItem(reportKey, JSON.stringify({
        local: data.get("local"), campo: data.get("campo"), descricao: description,
      }));
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return <form onSubmit={save} className="report-form" onChange={() => state !== "idle" && setState("idle")}>
    <div className="report-fields">
      <label className="field">Local
        <select name="local" required defaultValue={selected}>
          <option value="" disabled>Selecione um local</option>
          {locations.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
        </select>
      </label>
      <label className="field">Qual informação precisa de revisão?
        <select name="campo" required defaultValue="">
          <option value="" disabled>Selecione uma informação</option>
          <option>Localização</option><option>Horário</option><option>Serviços</option>
          <option>Ponto de referência</option><option>Outra informação</option>
        </select>
      </label>
    </div>
    <label className="field">Descreva o problema
      <textarea name="descricao" required maxLength={1200} rows={4} placeholder="Conte o que encontrou e qual seria a correção." />
    </label>
    <button className="primary">Registrar relato de teste</button>
    <div role="status">
      {state === "success" ? <p className="success"><CircleCheck size={20} aria-hidden="true" /> Relato salvo neste navegador para demonstração.</p> : null}
      {state === "error" ? <p className="error">Preencha a descrição e verifique se o navegador permite armazenamento local.</p> : null}
    </div>
  </form>;
}
