export interface DubbingRow {
  id: string;
  date: string;
  seriesName: string;
  characters: string;
  director: string;
  episodes: string;
  amount: string;
}

export interface ClientDetails {
  name: string;
  contact: string;
  address: string;
  gst: string;
}

export interface InvoiceData {
  invoiceDate: string;
  client: ClientDetails;
  rows: DubbingRow[];
  total: number;
}
