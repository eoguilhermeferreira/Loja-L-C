"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const PLACEMENTS = [
  "carousel",
  "promo_left",
  "promo_right",
  "square",
  "promo_wide",
  "video",
] as const;

const bannerSchema = z
  .object({
    title: z.string().trim().nullable(),
    description: z.string().trim().nullable(),
    eyebrow: z.string().trim().nullable(),
    image_url: z.string().trim().nullable(),
    video_url: z.string().trim().nullable(),
    button_label: z.string().trim().nullable(),
    button_link: z.string().trim().nullable(),
    placement: z.enum(PLACEMENTS),
    is_active: z.boolean(),
    display_order: z.number().int().default(0),
  })
  .refine((data) => data.placement !== "video" || !!data.video_url, {
    message: "Envie o link do vídeo",
    path: ["video_url"],
  })
  .refine((data) => data.placement === "video" || !!data.image_url, {
    message: "Envie uma imagem",
    path: ["image_url"],
  });

function optional(value: FormDataEntryValue | null) {
  return value ? String(value) : null;
}

function parseFormData(formData: FormData) {
  return bannerSchema.parse({
    title: optional(formData.get("title")),
    description: optional(formData.get("description")),
    eyebrow: optional(formData.get("eyebrow")),
    image_url: optional(formData.get("image_url")),
    video_url: optional(formData.get("video_url")),
    button_label: optional(formData.get("button_label")),
    button_link: optional(formData.get("button_link")),
    placement: formData.get("placement") || "carousel",
    is_active: formData.get("is_active") === "on",
    display_order: Number(formData.get("display_order") ?? 0),
  });
}

export async function createBanner(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const parsed = parseFormData(formData);
  const { error } = await supabase.from("banners").insert(parsed);
  if (error) return { error: error.message };

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return {};
}

export async function updateBanner(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const parsed = parseFormData(formData);
  const { error } = await supabase.from("banners").update(parsed).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return {};
}

export async function deleteBanner(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return {};
}
