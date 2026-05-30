import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Field =
  | string
  | {
      name: string;
      label: string;
      type?: "text" | "email" | "number" | "datetime-local" | "textarea" | "select" | "checkbox";
      required?: boolean;
      options?: readonly string[];
      placeholder?: string;
      defaultValue?: string | number;
    };

type FieldConfig = Exclude<Field, string>;

function fieldName(field: Field) {
  return typeof field === "string" ? field.toLowerCase().replaceAll(" ", "_") : field.name;
}

function fieldLabel(field: Field) {
  return typeof field === "string" ? field : field.label;
}

export function QuickCreateCard({ title, fields, action }: { title: string; fields: readonly Field[]; action?: (formData: FormData) => void | Promise<void> }) {
  return (
    <Card className="border-white/75 bg-white/95">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">Create records directly in Supabase. Empty optional fields can be filled later.</p>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3 sm:grid-cols-2">
          {fields.map((field) => {
            const name = fieldName(field);
            const label = fieldLabel(field);
            const config: Partial<FieldConfig> = typeof field === "string" ? {} : field;
            const type = config.type ?? "text";

            if (type === "textarea") {
              return (
                <label key={name} className="grid gap-1 text-sm font-semibold sm:col-span-2">
                  {label}
                  <Textarea name={name} placeholder={config.placeholder} required={config.required} defaultValue={config.defaultValue} />
                </label>
              );
            }

            if (type === "select") {
              return (
                <label key={name} className="grid gap-1 text-sm font-semibold">
                  {label}
                  <Select name={name} required={config.required} defaultValue={String(config.defaultValue ?? "")}>
                    <option value="">Select {label.toLowerCase()}</option>
                    {config.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </label>
              );
            }

            if (type === "checkbox") {
              return (
                <label key={name} className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2 text-sm font-semibold">
                  <input name={name} type="checkbox" defaultChecked={config.defaultValue === "on"} />
                  {label}
                </label>
              );
            }

            return (
              <label key={name} className="grid gap-1 text-sm font-semibold">
                {label}
                <Input name={name} type={type} placeholder={config.placeholder} required={config.required} defaultValue={config.defaultValue} />
              </label>
            );
          })}
          {action ? (
            <div className="sm:col-span-2">
              <Button className="mt-2" type="submit">
                <Plus className="h-4 w-4" /> Save record
              </Button>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
