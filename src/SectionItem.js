// src/SectionItem.js

// Komponen ini menerima icon (bisa berupa emoji atau gambar) dan title
function SectionItem({ icon, title }) {
  return (
    <div className="section-item">
      <div className="section-item-icon">{icon}</div>
      <p>{title}</p>
    </div>
  );
}

export default SectionItem;