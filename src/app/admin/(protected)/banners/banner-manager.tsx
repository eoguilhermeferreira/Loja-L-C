"use client";

import Image from "next/image";
import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createBanner, deleteBanner, updateBanner } from "@/app/admin/(protected)/banners/actions";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Banner, BannerPlacement } from "@/types/database.types";

const PLACEMENT_LABELS: Record<BannerPlacement, string> = {
  carousel: "Carrossel do topo",
  promo_left: "Promo — bloco esquerdo",
  promo_right: "Promo — bloco direito",
  square: "Banner quadrado (grande)",
  promo_wide: "Banner largo (atendimento etc.)",
};

export function BannerManager({ banners }: { banners: Banner[] }) {
  const [editing, setEditing] = React.useState<Banner | null>(null);
  const [open, setOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [isActive, setIsActive] = React.useState(true);
  const [placement, setPlacement] = React.useState<BannerPlacement>("carousel");
  const [isPending, startTransition] = React.useTransition();

  function openCreate() {
    setEditing(null);
    setImageUrl(null);
    setIsActive(true);
    setPlacement("carousel");
    setOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditing(banner);
    setImageUrl(banner.image_url);
    setIsActive(banner.is_active);
    setPlacement(banner.placement);
    setOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    if (!imageUrl) {
      toast.error("Envie uma imagem para o banner");
      return;
    }
    const action = editing ? updateBanner.bind(null, editing.id) : createBanner;
    const result = await action(formData);
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(editing ? "Banner atualizado" : "Banner criado");
    setOpen(false);
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteBanner(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Banner removido");
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Banners</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus /> Novo banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar banner" : "Novo banner"}</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Imagem</Label>
                <ImageUpload bucket="banners" value={imageUrl} onChange={setImageUrl} name="image_url" />
              </div>
              <div>
                <Label className="mb-1.5 block">Onde aparece</Label>
                <Select value={placement} onValueChange={(v) => setPlacement(v as BannerPlacement)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="placement" value={placement} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Carrossel do topo aceita vários banners; os outros mostram só o mais recente ativo.
                </p>
              </div>
              <div>
                <Label className="mb-1.5 block">Selo (opcional, ex: &quot;Para eles&quot;)</Label>
                <Input name="eyebrow" defaultValue={editing?.eyebrow ?? ""} />
              </div>
              <div>
                <Label className="mb-1.5 block">Título (opcional)</Label>
                <Input name="title" defaultValue={editing?.title ?? ""} />
              </div>
              <div>
                <Label className="mb-1.5 block">Descrição (opcional)</Label>
                <Textarea name="description" defaultValue={editing?.description ?? ""} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Texto do botão</Label>
                  <Input name="button_label" defaultValue={editing?.button_label ?? ""} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Link do botão</Label>
                  <Input name="button_link" defaultValue={editing?.button_link ?? ""} />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Ordem de exibição</Label>
                <Input name="display_order" type="number" defaultValue={editing?.display_order ?? 0} />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  name="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label>Ativo</Label>
              </div>
              <DialogFooter>
                <Button type="submit">{editing ? "Salvar" : "Criar"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <div key={banner.id} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative aspect-[16/7] bg-muted">
              <Image src={banner.image_url} alt={banner.title ?? ""} fill className="object-cover" />
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{banner.title || "Sem título"}</span>
                <Badge variant={banner.is_active ? "success" : "secondary"}>
                  {banner.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{PLACEMENT_LABELS[banner.placement]}</span>
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(banner)}>
                  <Pencil className="size-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover banner?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction disabled={isPending} onClick={() => handleDelete(banner.id)}>
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
