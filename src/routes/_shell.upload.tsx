import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CloudUpload, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

import { IconTile, Panel, PanelHead, PageIntro, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shell/upload")({
  head: () => ({
    meta: [
      { title: "Upload Data — Predict360" },
      {
        name: "description",
        content: "Drag and drop a CSV or Excel file and review its quality before analysing it.",
      },
      { property: "og:title", content: "Upload Data — Predict360" },
      { property: "og:description", content: "Bring your dataset into Predict360 in one step." },
    ],
  }),
  component: UploadPage,
});

const summary = [
  { label: "Rows", value: "5,240" },
  { label: "Columns", value: "18" },
  { label: "Missing Values", value: "34" },
  { label: "Duplicates", value: "6" },
  { label: "Quality Score", value: "92/100" },
];

function UploadPage() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="space-y-6">
      <PageIntro
        title="Upload Data"
        subtitle="Bring in a dataset and Predict360 will check its quality for you."
      />

      <Panel large className="mx-auto max-w-2xl p-8">
        <div
          className="flex flex-col items-center rounded-[20px] border border-dashed border-border bg-secondary/35 px-6 py-14 text-center transition-colors hover:bg-secondary/60"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setUploaded(true);
          }}
        >
          <IconTile icon={CloudUpload} tone="blue" className="size-14 rounded-2xl" />
          <h2 className="mt-5 text-[17px] font-semibold text-foreground">Upload your dataset</h2>
          <p className="mt-1.5 text-[13.5px] text-muted-foreground">
            Drag and drop your CSV or Excel file here.
          </p>
          <Button className="mt-6" onClick={() => setUploaded(true)}>
            Choose File
          </Button>
          <p className="mt-4 text-[12px] text-muted-foreground">
            Supports .csv, .xlsx — up to 50 MB
          </p>
        </div>
      </Panel>

      {uploaded && (
        <Panel large className="rise mx-auto max-w-2xl p-6">
          <PanelHead
            title="Dataset Preview"
            subtitle="sales_2026_q3.csv"
            action={<Pill tone="success">Ready</Pill>}
          />
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border p-4">
            <IconTile icon={FileSpreadsheet} tone="mint" className="size-9 rounded-[10px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-foreground">
                sales_2026_q3.csv
              </p>
              <p className="text-[12px] text-muted-foreground">1.8 MB • parsed successfully</p>
            </div>
            <CheckCircle2 className="size-5 text-success" strokeWidth={1.75} />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {summary.map((item) => (
              <div key={item.label} className="rounded-xl border border-border p-4">
                <dt className="text-[12px] text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 text-[17px] font-bold text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button>Continue to Analysis</Button>
            <Button variant="secondary" onClick={() => setUploaded(false)}>
              Replace File
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
