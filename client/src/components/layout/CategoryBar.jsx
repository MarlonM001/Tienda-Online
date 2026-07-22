import { Link, useLocation } from "react-router-dom";
import { CATEGORIES } from "../../constants/categories";

export default function CategoryBar() {
  const location = useLocation();
  const activeCategory = new URLSearchParams(location.search).get("cat");
  const isAllActive = location.pathname === "/" && !activeCategory;

  return (
    <nav className="category-bar" aria-label="Categorías">
      <Link to="/" className={isAllActive ? "active" : ""}>
        Todo
      </Link>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          to={`/?cat=${encodeURIComponent(cat)}#catalogo`}
          className={activeCategory === cat ? "active" : ""}
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}
