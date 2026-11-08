export const mockDashboard = {
  pendapatanHariIni: 1450000,
  bengkelAktif: 3,
  showroomTersedia: 4,
  stokMenipis: 2,
};

export const mockWorkOrders = [
  {
    id: "WO-2026-001",
    customer: "Budi Santoso",
    vehicle: "Honda Beat - B 1234 XYZ",
    complaint: "Ganti oli dan servis rutin, rem agak blong",
    status: "Dikerjakan",
    mechanic: "Slamet",
  },
  {
    id: "WO-2026-002",
    customer: "Siti Aminah",
    vehicle: "Yamaha NMAX - D 5678 ABC",
    complaint: "CVT berisik saat digas",
    status: "Inspeksi",
    mechanic: "Joko",
  }
];

export const mockShowroom = [
  { id: "MTR-01", name: "Yamaha NMAX 155 (2023)", price: 27500000, status: "Tersedia" },
  { id: "MTR-02", name: "Honda Vario 160 (2024)", price: 24000000, status: "Reserved" },
];