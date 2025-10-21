import{j as o,P as n}from"./app-D5LrGWPf.js";const e={name:"PT SUKUN WARTONO INDONESIA",address:"Jl. Raya Sukun no.1, Gondosari – Gebog, Kudus, Jawa Tengah 59354 - Indonesia",phone:"+62 291 432571",email:"info@sukunwartono.id",website:"www.sukunwartono.id",logoPath:n},r=({className:i})=>o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
      @media print {
        .print-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          display: flex;
          flex-direction: row;
          align-items: center;
          background-color: #ff0 !important;
          border-bottom: 1px solid #000;
          border-radius: 0 !important;
          padding: 10px 25px 10px 2.5cm;
          min-height: 2.5cm;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .print-header .logo {
          height: 1.5cm;
          width: 3cm;
          object-fit: contain;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .print-header .company-info {
          flex-grow: 1;
          font-size: 9pt;
          line-height: 1.3;
          color: #000;
        }
      }
    `}),o.jsxs("div",{className:`print-header ${i||""}`,children:[o.jsx("img",{src:e.logoPath,alt:"Logo Perusahaan",className:"logo"}),o.jsxs("div",{className:"company-info",children:[o.jsx("strong",{children:e.name})," ",o.jsx("br",{}),e.address," ",o.jsx("br",{}),"T: ",e.phone," | E: ",e.email," | ",e.website]})]})]});export{r as P};
