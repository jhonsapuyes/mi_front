import { Outlet, Link } from "react-router-dom";

const Layout = 
    <>
      <nav>
        <ul>
          <li>
            <Link to="/deportescolombia">HOME</Link>
          </li>
          <li>
            <Link to="/deportescolombia/register">REGISTRARSE</Link>
          </li>
          <li>
            <Link to="/deportescolombia/login">LOGIN</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  


export default Layout;