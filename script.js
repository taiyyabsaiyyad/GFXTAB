/* ---------- NAVIGATION ---------- */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: #000;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

header .logo {
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  transition: 0.3s;
}

nav a:hover {
  color: #ff9800;
}

/* ---------- MENU TOGGLE (HAMBURGER) ---------- */
.menu-toggle {
  font-size: 28px;
  cursor: pointer;
  display: none;
}

/* ---------- MOBILE NAV (HIDDEN BY DEFAULT) ---------- */
#nav-links {
  display: flex;
}

#nav-links.show {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 60px;
  right: 0;
  width: 220px;
  background: #111;
  padding: 20px;
  gap: 15px;
  z-index: 1001;
  border-left: 2px solid #222;
}

/* ---------- OVERLAY ---------- */
.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 900;
}

.overlay.active {
  display: block;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  nav {
    display: none;
  }

  #nav-links {
    display: none;
  }
}
