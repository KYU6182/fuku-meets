import type { AiBannerDraft, AiContentType, AiGeneratedText, AiQualityCheckResult, AiRankingIdea, AiShopImportCandidate, AiTagResult } from "@/types/ai";

export function generateMockText({
  contentType,
  source,
  tone,
}: {
  contentType: AiContentType;
  source: string;
  tone: string;
}): AiGeneratedText {
  const seed = source.trim() || "福岡の注目スポット";
  return {
    contentType,
    tone,
    title: `${seed.slice(0, 22)}をFUKU-MEETSらしく紹介`,
    body: `${seed}について、福岡のリアルな空気感が伝わるように整理しました。\n\n街の距離感、使いやすい時間帯、誰におすすめしたいかを軸に、読者が「行ってみたい」「応援したい」と思えるトーンでまとめています。\n\n公開前には画像、alt、リンク、PR表記、タグを確認してください。`,
  };
}

export function generateMockTags(source: string): AiTagResult {
  const text = source || "薬院 夜カフェ ひとり時間 デート 雨の日 今営業中";
  const areaTags = ["薬院", "大名", "天神", "今泉"].filter((tag) => text.includes(tag)).concat(text.includes("博多") ? ["博多"] : []);
  return {
    areaTags: areaTags.length ? areaTags : ["薬院", "天神"],
    genreTags: text.includes("美容") ? ["美容室"] : text.includes("ラーメン") ? ["ラーメン"] : ["カフェ"],
    moodTags: ["ひとり時間", "デート", "雨の日", "今営業中"],
    weekendGuideTags: ["夜カフェ", "作業", "保存が多い"],
    seoTags: ["福岡", "ローカル", "FUKU-MEETS", "週末ガイド"],
  };
}

export function generateRankingIdeas({ area, genre, target, purpose }: { area: string; genre: string; target: string; purpose: string }): AiRankingIdea[] {
  const baseArea = area || "福岡";
  const baseGenre = genre || "カフェ";
  const baseTarget = target || "福岡初心者";
  const basePurpose = purpose || "保存と投票を増やす";
  return [
    {
      title: `${baseArea}でひとり時間に使える${baseGenre}`,
      description: `${baseTarget}が迷わず選べる、実用性の高いランキング。目的は${basePurpose}。`,
      category: "WEEKEND / FOOD",
      candidates: [`${baseArea}の静かな店`, `駅近の${baseGenre}`, "夜まで使える店"],
      socialPost: `${baseArea}でひとり時間、どこ行く？みんなの推し${baseGenre}を投票で教えて。`,
    },
    {
      title: `${baseArea}で今夜行ける${baseGenre}`,
      description: "今営業中、入りやすさ、保存数を軸にした即時性のあるテーマ。",
      category: "NIGHT",
      candidates: ["今営業中の人気店", "2軒目に使える店", "友達に送りたい店"],
      socialPost: `今夜の${baseArea}、どこ行く？リアルに助かる店をランキング化します。`,
    },
    {
      title: `${baseTarget}におすすめの${baseArea}定番${baseGenre}`,
      description: "新生活、旅行、初デートなど横展開しやすいSEO向けテーマ。",
      category: "AREA",
      candidates: ["駅近の定番", "地元で愛される店", "写真を撮りたくなる店"],
      socialPost: `${baseTarget}に届けたい、${baseArea}の定番${baseGenre}を募集します。`,
    },
  ];
}

export function runQualityCheck(source: string): AiQualityCheckResult[] {
  const length = source.trim().length;
  return [
    { item: "タイトル", status: length > 10 ? "OK" : "注意", message: "検索意図とクリックしたくなる具体性を確認してください。" },
    { item: "画像", status: "注意", message: "メイン画像、alt、横長/縦長の表示崩れを公開前に確認。" },
    { item: "SEO description", status: length > 80 ? "OK" : "修正推奨", message: "80文字以上の要約があると検索向けに扱いやすくなります。" },
    { item: "タグ", status: "OK", message: "エリア、ジャンル、気分タグを最低1つずつ設定してください。" },
    { item: "PR表記", status: "注意", message: "タイアップや提供がある場合はPR表記を必ず追加。" },
    { item: "リンク切れ", status: "OK", message: "内部リンクはslugベースで管理し、公開前チェック対象にします。" },
    { item: "不適切表現", status: "OK", message: "断定しすぎる表現、年齢制限コンテンツ、権利表記を確認。" },
  ];
}

export function generateBannerDrafts({ type, title, subtitle, color }: { type: string; title: string; subtitle: string; color: string }): AiBannerDraft[] {
  const mainTitle = title || "FUKU-MEETS";
  const sub = subtitle || "福岡のリアルに、会いにいく。";
  return [
    { title: mainTitle, subtitle: sub, palette: color || "#e52421", layout: `${type} / 左タイトル + 右写真` },
    { title: `${mainTitle} WEEKEND`, subtitle: sub, palette: "#111111", layout: `${type} / 黒背景 + 赤CTA` },
    { title: `${mainTitle} GUIDE`, subtitle: sub, palette: "#fff1f1", layout: `${type} / 淡色背景 + 雑誌見出し` },
  ];
}

export function importShopCandidates({ area, genre, source }: { area: string; genre: string; source: string }): AiShopImportCandidate[] {
  const baseArea = area || "大名";
  const baseGenre = genre || "カフェ";
  const baseSource = source || "Google Places";
  return [
    {
      id: "candidate-1",
      name: `${baseArea}の隠れ家${baseGenre}`,
      area: baseArea,
      genre: baseGenre,
      source: baseSource,
      generatedDescription: `管理者確認前の候補です。${baseArea}で使いやすい${baseGenre}として、FUKU-MEETS向け紹介文を仮生成しました。`,
      tags: [baseArea, baseGenre, "今営業中", "ひとりOK"],
      duplicateStatus: "重複なし",
    },
    {
      id: "candidate-2",
      name: `${baseArea}駅近${baseGenre}`,
      area: baseArea,
      genre: baseGenre,
      source: baseSource,
      generatedDescription: "駅近・保存向き・週末導線に合う候補として整形しました。",
      tags: [baseArea, baseGenre, "駅近", "保存が多い"],
      duplicateStatus: "要確認",
    },
  ];
}

// Future OpenAI integration:
// - Replace these deterministic mock functions with server actions calling the OpenAI API.
// - Keep prompts server-side, log admin usage, and require admin role before generation.
// - Never publish generated content automatically; keep administrator review before public release.
