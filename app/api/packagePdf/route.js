import connectDB from "@/lib/connectDB";
import PackagePdf from "@/models/PackagePdf";
import Packages from "@/models/Packages";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const packageId = searchParams.get("packageId");
  try {
    let pdfs;
    if (packageId) {
      pdfs = await PackagePdf.find({ packageId });
    } else {
      pdfs = await PackagePdf.find();
    }
    return Response.json({ success: true, data: pdfs });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { packageId, name, url, key } = body;
    if (!packageId || !name || !url || !key) {
      return Response.json({ success: false, error: "All fields required" }, { status: 400 });
    }
    const pdf = await PackagePdf.create({ packageId, name, url, key });
    // Optionally add to Packages model
    await Packages.findByIdAndUpdate(packageId, { $push: { pdfs: pdf._id } });
    return Response.json({ success: true, data: pdf });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ success: false, error: "id required" }, { status: 400 });
    const pdf = await PackagePdf.findByIdAndDelete(id);
    if (pdf) {
      await Packages.findByIdAndUpdate(pdf.packageId, { $pull: { pdfs: pdf._id } });
    }
    return Response.json({ success: true, data: pdf });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  await connectDB();
  try {
    const body = await req.json();
    const { id, name, url, key } = body;
    if (!id) return Response.json({ success: false, error: "id required" }, { status: 400 });
    const update = {};
    if (name) update.name = name;
    if (url) update.url = url;
    if (key) update.key = key;
    const pdf = await PackagePdf.findByIdAndUpdate(id, update, { new: true });
    return Response.json({ success: true, data: pdf });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
