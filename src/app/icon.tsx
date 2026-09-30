import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background:
            "radial-gradient(circle at 22% 18%, #a78bfa 0%, rgba(167,139,250,0) 60%)," +
            "radial-gradient(circle at 82% 85%, #34d399 0%, rgba(52,211,153,0) 60%)," +
            "#0a0710",
        }}
      >
        <span
          style={{
            fontSize: 21,
            fontWeight: 700,
            color: "#f4f2f8",
            letterSpacing: "-0.03em",
          }}
        >
          F/.
        </span>
      </div>
    ),
    { ...size },
  );
}
