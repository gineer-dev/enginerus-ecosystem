import { Search } from "lucide-react";
import { categories } from "@/constants/sample-data";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function FilterBar({ action = "/", hideCategory = false }: { action?: string; hideCategory?: boolean }) {
  return (
    <form action={action} className="grid gap-3 border border-black/15 bg-white p-4 shadow-[8px_8px_0_rgba(0,0,0,0.08)] md:grid-cols-[1.3fr_repeat(5,1fr)_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input name="q" placeholder="Search brand-new motorcycles, brand, model" className="rounded-none border border-black/10 bg-[#f4eadc] pl-9 shadow-none" />
      </div>
      {hideCategory ? null : (
        <Select name="category" defaultValue="" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none">
          <option value="">Brand / category</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </Select>
      )}
      <Input name="brand" placeholder="Brand" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
      <Select name="condition" defaultValue="" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none">
        <option value="">Condition</option>
        <option>Brand New</option>
      </Select>
      <Select name="status" defaultValue="" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none">
        <option value="">Availability</option>
        <option>Ready</option>
      </Select>
      <Input name="location" placeholder="Showroom" className="rounded-none border border-black/10 bg-[#f4eadc] shadow-none" />
      <Button type="submit" className="rounded-none bg-[#ff5a1f] px-7 text-xs font-black uppercase tracking-[0.12em] text-white shadow-none hover:bg-black">Filter</Button>
    </form>
  );
}
