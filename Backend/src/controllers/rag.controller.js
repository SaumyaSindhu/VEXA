import { loadAndSplitPDF, storeDocuments } from "../services/rag.service.js";

export async function uploadPDFController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
      });
    }

    const docs = await loadAndSplitPDF(req.file.path);

    // pass userId for multi-user
    await storeDocuments(docs, req.user.id);

    res.status(200).json({
      message: "PDF uploaded and processed successfully",
      success: true,
    });
  } catch (err) {
    console.error("PDF Processing Error:", err);
    res.status(500).json({
      message: err?.message || "Failed to process PDF",
      success: false,
    });
  }
}