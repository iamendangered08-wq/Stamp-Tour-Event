export type StampMeta = {
  id: number;
  label: string;
  iconPath: string; // public 기준의 절대경로: "/icons/stamp1.svg"
};

const STAMPS: StampMeta[] = [
  { id: 1, label: "LS ELECTRIC", iconPath: "/icons/stamp1.svg" },
  { id: 2, label: "CTR Transformer", iconPath: "/icons/stamp2.svg" },
  { id: 3, label: "RE+ / Green", iconPath: "/icons/stamp3.svg" },
  { id: 4, label: "Data Center Rack", iconPath: "/icons/stamp4.svg" },
  { id: 5, label: "Container", iconPath: "/icons/stamp5.svg" },
  { id: 6, label: "Smart Factory", iconPath: "/icons/stamp6.svg" },
  { id: 7, label: "Bolt", iconPath: "/icons/stamp7.svg" }
];

export function getStampMeta(id: number): StampMeta | null {
  return STAMPS.find(s => s.id === id) ?? null;
}

export function getAllStamps(): StampMeta[] {
  return STAMPS;
}
