// "use client";
//
// import React, { use } from "react";
// import Document from "@/components/Document";
//
// type Params = Promise<{ id: string }>;
//
// export default function DocumentPage(props: {
//   children: React.ReactNode;
//   params: Params;
// }) {
//   const params = use(props.params);
//   const id = params.id;
//
//   return (
//     <div className="flex min-h-screen flex-1 flex-col">
//       <Document id={id} />
//     </div>
//   );
// }

"use client";

import React, { use } from "react";
import Document from "@/components/Document";

type Params = { id: string };

type DocumentPageProps = {
  params: Promise<Params>;
};

export default function DocumentPage({ params }: DocumentPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Document id={id} />
    </div>
  );
}
