const extractPublicId = (url) => {
  try {
    // EXTRACT PUBLIC ID FROM URL
    // EXAMPLE: https://res.cloudinary.com/dacm612s6/raw/upload/v1786857525/book-pdfs/the-great-gatsby-1786857516788.pdf
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) return null;

    // REMOVE VERSION NUMBER
    const versionIndex = uploadIndex + 2;
    const publicIdWithExt = parts.slice(versionIndex).join("/");

    // REMOVE EXTENSION
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    console.log("Error extracting public id: ", error.message);

    return null;
  }
};

export { extractPublicId };
