// Utility to generate realistic, high-resolution SVG document images for scholarship verification
// Renders authentic-looking certificates, Aadhaar cards, and marksheets as SVG data-URIs

export function getDocumentPreviewUrl(docId: string, docName: string, docNumberMask?: string): string {
  const cleanName = docName.toLowerCase();

  if (docId === 'doc-aadhaar' || cleanName.includes('aadhaar') || cleanName.includes('uidai')) {
    return generateAadhaarCardSvg(docNumberMask || 'XXXX XXXX 8924');
  }

  if (docId === 'doc-st' || cleanName.includes('tribe') || cleanName.includes('caste')) {
    return generateStCertificateSvg(docNumberMask || 'JH/TRB/2022/XXXX-4912');
  }

  if (docId === 'doc-income' || cleanName.includes('income')) {
    return generateIncomeCertificateSvg(docNumberMask || 'REV/INC/2026/XXXX-8821');
  }

  if (docId === 'doc-domicile' || cleanName.includes('domicile') || cleanName.includes('residence')) {
    return generateDomicileCertificateSvg(docNumberMask || 'JH/DOM/2023/XXXX-1029');
  }

  if (docId === 'doc-marksheet' || cleanName.includes('marksheet') || cleanName.includes('academic') || cleanName.includes('cbse')) {
    return generateMarksheetSvg(docNumberMask || 'CBSE/2024/XXXX-5931');
  }

  if (docId === 'doc-bank' || cleanName.includes('bank') || cleanName.includes('passbook')) {
    return generateBankPassbookSvg(docNumberMask || 'SBI/XXXX-XXXX-4521');
  }

  if (docId === 'doc-disability' || cleanName.includes('disability') || cleanName.includes('udid')) {
    return generateUdidCardSvg(docNumberMask || 'UDID/2025/XXXX-0012');
  }

  return generateGenericGovtCertificateSvg(docName, docNumberMask || 'MOTA/2026/DOC-8831');
}

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// 1. Aadhaar Card UIDAI Preview
function generateAadhaarCardSvg(mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 580" width="900" height="580" style="background:#ffffff; font-family:system-ui, -apple-system, sans-serif;">
    <!-- Outer Card Border -->
    <rect x="15" y="15" width="870" height="550" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
    
    <!-- Top Tricolor Ribbon -->
    <path d="M 15 39 Q 450 39 885 39" stroke="#FF9933" stroke-width="12" fill="none"/>
    <path d="M 15 51 Q 450 51 885 51" stroke="#ffffff" stroke-width="8" fill="none"/>
    <path d="M 15 59 Q 450 59 885 59" stroke="#138808" stroke-width="8" fill="none"/>

    <!-- Header -->
    <g transform="translate(45, 85)">
      <!-- Government of India / UIDAI Logo Simulation -->
      <circle cx="35" cy="35" r="28" fill="#1e293b"/>
      <path d="M 35 15 L 35 55 M 15 35 L 55 35 M 21 21 L 49 49 M 21 49 L 49 21" stroke="#ffffff" stroke-width="3"/>
      <circle cx="35" cy="35" r="10" fill="#f8fafc"/>
      
      <text x="80" y="24" font-size="20" font-weight="800" fill="#0f172a">भारत सरकार</text>
      <text x="80" y="46" font-size="16" font-weight="700" fill="#334155">GOVERNMENT OF INDIA</text>
      
      <text x="560" y="24" font-size="15" font-weight="800" fill="#0369a1" text-anchor="end">भारतीय विशिष्ट पहचान प्राधिकरण</text>
      <text x="560" y="44" font-size="13" font-weight="600" fill="#64748b" text-anchor="end">Unique Identification Authority of India</text>
    </g>

    <line x1="45" y1="160" x2="855" y2="160" stroke="#e2e8f0" stroke-width="2"/>

    <!-- Body Content -->
    <!-- Photo Box -->
    <rect x="55" y="190" width="180" height="230" rx="16" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="145" cy="260" r="45" fill="#cbd5e1"/>
    <path d="M 85 385 C 85 320, 205 320, 205 385 Z" fill="#94a3b8"/>
    <text x="145" y="405" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">SANJAY KUMAR</text>

    <!-- Details Column -->
    <g transform="translate(265, 205)">
      <text x="0" y="25" font-size="15" font-weight="700" fill="#64748b">नाम / Name</text>
      <text x="0" y="55" font-size="24" font-weight="800" fill="#0f172a">संजय कुमार / Sanjay Kumar</text>

      <text x="0" y="100" font-size="15" font-weight="700" fill="#64748b">जन्म तिथि / Date of Birth</text>
      <text x="0" y="125" font-size="20" font-weight="700" fill="#1e293b">15/07/2004</text>

      <text x="0" y="170" font-size="15" font-weight="700" fill="#64748b">लिंग / Gender</text>
      <text x="0" y="195" font-size="20" font-weight="700" fill="#1e293b">पुरुष / Male</text>
    </g>

    <!-- QR Code Graphic Simulation -->
    <g transform="translate(680, 195)">
      <rect x="0" y="0" width="160" height="160" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <!-- QR Blocks -->
      <rect x="15" y="15" width="40" height="40" fill="#0f172a"/>
      <rect x="25" y="25" width="20" height="20" fill="#ffffff"/>
      <rect x="105" y="15" width="40" height="40" fill="#0f172a"/>
      <rect x="115" y="25" width="20" height="20" fill="#ffffff"/>
      <rect x="15" y="105" width="40" height="40" fill="#0f172a"/>
      <rect x="25" y="115" width="20" height="20" fill="#ffffff"/>
      <!-- Internal bits -->
      <rect x="65" y="25" width="15" height="15" fill="#0f172a"/>
      <rect x="65" y="50" width="25" height="15" fill="#0f172a"/>
      <rect x="35" y="65" width="15" height="25" fill="#0f172a"/>
      <rect x="75" y="75" width="30" height="20" fill="#0f172a"/>
      <rect x="115" y="75" width="20" height="20" fill="#0f172a"/>
      <rect x="65" y="105" width="20" height="35" fill="#0f172a"/>
      <rect x="95" y="125" width="35" height="15" fill="#0f172a"/>
      <text x="80" y="185" font-size="11" font-weight="700" fill="#0284c7" text-anchor="middle">SECURE UIDAI QR</text>
    </g>

    <!-- Aadhaar Mask Number Ribbon -->
    <g transform="translate(450, 470)">
      <rect x="-380" y="-30" width="760" height="60" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
      <text x="0" y="12" font-size="32" font-family="monospace" font-weight="800" fill="#047857" letter-spacing="4" text-anchor="middle">
        ${mask}
      </text>
    </g>

    <!-- Footer -->
    <rect x="15" y="515" width="870" height="50" rx="0" fill="#047857"/>
    <text x="450" y="546" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">
      मेरा आधार, मेरी पहचान • DigiLocker Verified &amp; APBS Linked
    </text>
  </svg>`;
  return svgToDataUrl(svg);
}

// 2. Scheduled Tribe Caste Certificate
function generateStCertificateSvg(mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#fffdf9; font-family:Georgia, serif;">
    <!-- Outer Border -->
    <rect x="25" y="25" width="800" height="1050" fill="#fffdf9" stroke="#78350f" stroke-width="4"/>
    <rect x="35" y="35" width="780" height="1030" fill="none" stroke="#b45309" stroke-width="1.5" stroke-dasharray="6,4"/>

    <!-- Watermark Seal Simulation -->
    <circle cx="425" cy="550" r="220" fill="none" stroke="#fde68a" stroke-width="3" opacity="0.35"/>
    <text x="425" y="560" font-size="42" font-family="sans-serif" font-weight="900" fill="#fef08a" opacity="0.4" text-anchor="middle" transform="rotate(-30 425 550)">
      JHARKHAND TRIBAL WELFARE
    </text>

    <!-- State Emblem Header -->
    <g transform="translate(425, 90)">
      <circle cx="0" cy="0" r="36" fill="#78350f"/>
      <path d="M -15 -10 L 15 -10 L 10 15 L -10 15 Z" fill="#fef3c7"/>
      <circle cx="0" cy="-2" r="8" fill="#78350f"/>
      <text x="0" y="55" font-size="18" font-family="sans-serif" font-weight="800" fill="#78350f" text-anchor="middle">GOVERNMENT OF JHARKHAND</text>
      <text x="0" y="76" font-size="14" font-family="sans-serif" font-weight="600" fill="#451a03" text-anchor="middle">OFFICE OF THE SUB-DIVISIONAL OFFICER / TEHSILDAR, RANCHI</text>
      <text x="0" y="105" font-size="22" font-family="sans-serif" font-weight="800" fill="#9a3412" text-anchor="middle" letter-spacing="1">
        SCHEDULED TRIBE (ST) CERTIFICATE
      </text>
      <text x="0" y="128" font-size="13" font-family="monospace" font-weight="700" fill="#78350f" text-anchor="middle">Certificate Ref No: ${mask}</text>
    </g>

    <line x1="80" y1="245" x2="770" y2="245" stroke="#b45309" stroke-width="1.5"/>

    <!-- Body Paragraphs -->
    <g transform="translate(80, 290)" font-size="16" fill="#1c1917" style="line-height: 1.8;">
      <text x="0" y="0">This is to officially certify that <tspan font-weight="bold" fill="#047857">SHRI SANJAY KUMAR</tspan>, son of <tspan font-weight="bold">Ramesh Kumar</tspan>,</text>
      <text x="0" y="32">resident of Village / Mohalla <tspan font-weight="bold">Morabadi</tspan>, Police Station <tspan font-weight="bold">Bariatu</tspan>,</text>
      <text x="0" y="64">District <tspan font-weight="bold">Ranchi</tspan>, in the State of <tspan font-weight="bold">Jharkhand</tspan>, belongs to the:</text>
      
      <rect x="60" y="95" width="570" height="50" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="345" y="127" font-size="20" font-family="sans-serif" font-weight="800" fill="#92400e" text-anchor="middle">
        ORAON / SANTHAL COMMUNITY (SCHEDULED TRIBE)
      </text>

      <text x="0" y="180">which is recognized as a Scheduled Tribe under the Constitution (Scheduled Tribes)</text>
      <text x="0" y="212">Order, 1950, as amended by the Scheduled Castes and Scheduled Tribes Lists</text>
      <text x="0" y="244">(Modification) Order, 1956 and the Bihar Reorganisation Act, 2000 (Jharkhand).</text>

      <text x="0" y="295">2. Shri Sanjay Kumar and his family ordinarily reside(s) in District Ranchi of the State</text>
      <text x="0" y="327">of Jharkhand, as verified by local revenue records and field enquiry.</text>

      <text x="0" y="380">3. This certificate is issued digitally under statutory authority for availing post-matric</text>
      <text x="0" y="412">scholarships and benefits under the Ministry of Tribal Affairs (MoTA), New Delhi.</text>
    </g>

    <!-- Official Stamp & Signature Block -->
    <g transform="translate(80, 800)">
      <!-- QR code box -->
      <rect x="10" y="10" width="130" height="130" fill="#ffffff" stroke="#a8a29e" stroke-width="2"/>
      <rect x="25" y="25" width="30" height="30" fill="#1c1917"/>
      <rect x="95" y="25" width="30" height="30" fill="#1c1917"/>
      <rect x="25" y="95" width="30" height="30" fill="#1c1917"/>
      <rect x="65" y="45" width="20" height="20" fill="#1c1917"/>
      <rect x="65" y="85" width="20" height="30" fill="#1c1917"/>
      <text x="75" y="160" font-size="11" font-family="sans-serif" font-weight="700" fill="#047857" text-anchor="middle">e-Sign Verified</text>

      <!-- Seal -->
      <g transform="translate(300, 75)">
        <circle cx="0" cy="0" r="55" fill="none" stroke="#991b1b" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="46" fill="none" stroke="#991b1b" stroke-width="1" stroke-dasharray="4,2"/>
        <text x="0" y="-12" font-size="11" font-family="sans-serif" font-weight="800" fill="#991b1b" text-anchor="middle">SUB-DIVISIONAL MAGISTRATE</text>
        <text x="0" y="6" font-size="12" font-family="sans-serif" font-weight="900" fill="#991b1b" text-anchor="middle">★ RANCHI ★</text>
        <text x="0" y="22" font-size="10" font-family="sans-serif" font-weight="700" fill="#991b1b" text-anchor="middle">JHARKHAND</text>
      </g>

      <!-- Signature Column -->
      <g transform="translate(520, 40)">
        <path d="M 10 35 Q 45 10 90 35 T 140 30" stroke="#0369a1" stroke-width="2.5" fill="none"/>
        <text x="80" y="65" font-size="13" font-family="sans-serif" font-weight="800" fill="#0f172a" text-anchor="middle">Digitally Signed By</text>
        <text x="80" y="82" font-size="13" font-family="sans-serif" font-weight="700" fill="#047857" text-anchor="middle">Rajeev Ranjan, IAS</text>
        <text x="80" y="99" font-size="11" font-family="sans-serif" fill="#475569" text-anchor="middle">Sub-Divisional Officer, Ranchi</text>
        <text x="80" y="115" font-size="10" font-family="sans-serif" fill="#64748b" text-anchor="middle">Date: 10 Aug 2026, 11:24 IST</text>
      </g>
    </g>

    <!-- Footer Banner -->
    <rect x="25" y="1030" width="800" height="45" fill="#f8fafc"/>
    <text x="425" y="1058" font-size="12" font-family="sans-serif" font-weight="600" fill="#64748b" text-anchor="middle">
      Digitally generated via Jharkhand JharSewa Portal • Verified &amp; Tamper-Proof in National DigiLocker
    </text>
  </svg>`;
  return svgToDataUrl(svg);
}

// 3. Annual Family Income Certificate
function generateIncomeCertificateSvg(mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#ffffff; font-family:system-ui, sans-serif;">
    <rect x="25" y="25" width="800" height="1050" fill="#ffffff" stroke="#047857" stroke-width="4"/>
    <rect x="35" y="35" width="780" height="1030" fill="none" stroke="#10b981" stroke-width="1.5"/>

    <g transform="translate(425, 95)">
      <circle cx="0" cy="0" r="32" fill="#065f46"/>
      <text x="0" y="50" font-size="18" font-weight="800" fill="#065f46" text-anchor="middle">GOVERNMENT OF JHARKHAND</text>
      <text x="0" y="70" font-size="14" font-weight="600" fill="#334155" text-anchor="middle">REVENUE &amp; LAND REFORMS DEPARTMENT</text>
      <text x="0" y="100" font-size="22" font-weight="900" fill="#047857" text-anchor="middle">ANNUAL INCOME CERTIFICATE</text>
      <text x="0" y="122" font-size="13" font-family="monospace" font-weight="700" fill="#475569" text-anchor="middle">Registration: ${mask}</text>
    </g>

    <line x1="80" y1="240" x2="770" y2="240" stroke="#cbd5e1" stroke-width="2"/>

    <g transform="translate(80, 280)" font-size="15" fill="#1e293b" style="line-height: 1.8;">
      <text x="0" y="0">This is to certify that upon due verification of local revenue records and spot enquiry,</text>
      <text x="0" y="30">the total annual income from all sources of the family of:</text>

      <rect x="20" y="55" width="650" height="130" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
      <text x="45" y="90" font-size="14" font-weight="600" fill="#15803d">Applicant Name:</text>
      <text x="185" y="90" font-size="16" font-weight="800" fill="#0f172a">SANJAY KUMAR</text>

      <text x="45" y="120" font-size="14" font-weight="600" fill="#15803d">Father's Name:</text>
      <text x="185" y="120" font-size="16" font-weight="700" fill="#0f172a">Ramesh Kumar</text>

      <text x="45" y="150" font-size="14" font-weight="600" fill="#15803d">Address:</text>
      <text x="185" y="150" font-size="15" font-weight="600" fill="#334155">Ward 14, Morabadi, Ranchi, Jharkhand - 834008</text>

      <!-- Certified Income Callout -->
      <g transform="translate(0, 220)">
        <rect x="0" y="0" width="690" height="85" rx="16" fill="#065f46"/>
        <text x="345" y="32" font-size="14" font-weight="700" fill="#a7f3d0" text-anchor="middle">TOTAL CERTIFIED ANNUAL FAMILY INCOME</text>
        <text x="345" y="66" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">
          ₹ 1,80,000 /- (Rupees One Lakh Eighty Thousand Only)
        </text>
      </g>

      <g transform="translate(0, 335)">
        <text x="0" y="0" font-weight="600">Source Breakdown:</text>
        <text x="20" y="25">• Agriculture / Cultivation: ₹ 90,000 / annum</text>
        <text x="20" y="50">• Allied Services &amp; Wages: ₹ 90,000 / annum</text>
        <text x="20" y="75">• Total Verified by Circle Officer (CO): ₹ 1,80,000 / annum</text>
        <text x="0" y="115">This certificate is issued exclusively for Higher Education Scholarship under MoTA schemes.</text>
        <text x="0" y="140">Validity: Financial Year 2026–2027.</text>
      </g>
    </g>

    <!-- Signatures & Verification Stamp -->
    <g transform="translate(80, 840)">
      <rect x="10" y="10" width="120" height="120" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="25" y="25" width="90" height="90" fill="#0f172a" opacity="0.85"/>
      <text x="70" y="145" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">UIDAI Linked</text>

      <g transform="translate(480, 40)">
        <path d="M 10 25 Q 50 5 95 25 T 150 20" stroke="#1d4ed8" stroke-width="2.5" fill="none"/>
        <text x="80" y="55" font-size="13" font-weight="800" fill="#0f172a" text-anchor="middle">Tehsildar / Circle Officer</text>
        <text x="80" y="75" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">Ranchi Revenue Circle</text>
        <text x="80" y="92" font-size="10" fill="#64748b" text-anchor="middle">Digitally Signed (DSC Certified)</text>
      </g>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 4. State Domicile Certificate
function generateDomicileCertificateSvg(mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#ffffff; font-family:system-ui, sans-serif;">
    <rect x="25" y="25" width="800" height="1050" fill="#ffffff" stroke="#1e3a8a" stroke-width="4"/>
    <rect x="35" y="35" width="780" height="1030" fill="none" stroke="#3b82f6" stroke-width="1.5"/>

    <g transform="translate(425, 95)">
      <circle cx="0" cy="0" r="32" fill="#1e3a8a"/>
      <text x="0" y="52" font-size="18" font-weight="800" fill="#1e3a8a" text-anchor="middle">GOVERNMENT OF JHARKHAND</text>
      <text x="0" y="74" font-size="14" font-weight="600" fill="#475569" text-anchor="middle">DISTRICT ADMINISTRATION, RANCHI</text>
      <text x="0" y="104" font-size="22" font-weight="900" fill="#1d4ed8" text-anchor="middle">RESIDENTIAL / DOMICILE CERTIFICATE</text>
      <text x="0" y="126" font-size="13" font-family="monospace" font-weight="700" fill="#64748b" text-anchor="middle">Certificate ID: ${mask}</text>
    </g>

    <line x1="80" y1="240" x2="770" y2="240" stroke="#cbd5e1" stroke-width="2"/>

    <g transform="translate(80, 290)" font-size="16" fill="#1e293b" style="line-height: 1.8;">
      <text x="0" y="0">This is to certify that <tspan font-weight="bold">SANJAY KUMAR</tspan>, son of <tspan font-weight="bold">Ramesh Kumar</tspan>,</text>
      <text x="0" y="32">is a permanent bonafide resident of the State of Jharkhand.</text>

      <g transform="translate(20, 70)">
        <rect x="0" y="0" width="650" height="110" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
        <text x="30" y="35" font-size="14" font-weight="600" fill="#1d4ed8">Permanent Address:</text>
        <text x="180" y="35" font-size="15" font-weight="700" fill="#0f172a">House No. 42, Morabadi, Post: Bariatu</text>
        <text x="30" y="65" font-size="14" font-weight="600" fill="#1d4ed8">District &amp; State:</text>
        <text x="180" y="65" font-size="15" font-weight="700" fill="#0f172a">Ranchi, Jharkhand - PIN 834008</text>
        <text x="30" y="95" font-size="14" font-weight="600" fill="#1d4ed8">Domicile Rule Category:</text>
        <text x="180" y="95" font-size="15" font-weight="700" fill="#0f172a">Khatiyan Registered / Continuous Residence &gt; 15 Years</text>
      </g>

      <text x="0" y="225">This certificate satisfies the state domicile criteria for Central and State Tribal</text>
      <text x="0" y="255">Scholarship grants, DBT transfers, and higher educational allocations.</text>
    </g>

    <g transform="translate(80, 820)">
      <rect x="10" y="10" width="110" height="110" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
      <text x="65" y="70" font-size="12" font-weight="700" fill="#1e3a8a" text-anchor="middle">QR VERIFIED</text>
      <g transform="translate(480, 30)">
        <text x="80" y="45" font-size="14" font-weight="800" fill="#0f172a" text-anchor="middle">Authorized Signatory</text>
        <text x="80" y="68" font-size="13" font-weight="600" fill="#1d4ed8" text-anchor="middle">Executive Magistrate, Ranchi</text>
      </g>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 5. Academic Marksheet (CBSE / University)
function generateMarksheetSvg(mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#ffffff; font-family:system-ui, sans-serif;">
    <rect x="25" y="25" width="800" height="1050" fill="#ffffff" stroke="#475569" stroke-width="3"/>
    
    <g transform="translate(425, 80)">
      <circle cx="0" cy="0" r="30" fill="#1e293b"/>
      <text x="0" y="48" font-size="18" font-weight="900" fill="#0f172a" text-anchor="middle">CENTRAL BOARD OF SECONDARY EDUCATION</text>
      <text x="0" y="68" font-size="13" font-weight="700" fill="#64748b" text-anchor="middle">NATIONAL ACADEMIC DEPOSITORY (DIGILOCKER VERIFIED)</text>
      <text x="0" y="95" font-size="20" font-weight="800" fill="#0284c7" text-anchor="middle">SENIOR SCHOOL CERTIFICATE EXAMINATION</text>
      <text x="0" y="118" font-size="12" font-family="monospace" font-weight="700" fill="#475569" text-anchor="middle">Roll / Ref: ${mask}</text>
    </g>

    <g transform="translate(80, 230)">
      <rect x="0" y="0" width="690" height="90" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="25" y="32" font-size="13" font-weight="700" fill="#475569">Candidate Name:</text>
      <text x="160" y="32" font-size="15" font-weight="800" fill="#0f172a">SANJAY KUMAR</text>

      <text x="400" y="32" font-size="13" font-weight="700" fill="#475569">School / College:</text>
      <text x="530" y="32" font-size="13" font-weight="700" fill="#0f172a">Jawahar Navodaya Vidyalaya</text>

      <text x="25" y="68" font-size="13" font-weight="700" fill="#475569">Current Enrolment:</text>
      <text x="160" y="68" font-size="14" font-weight="800" fill="#047857">NIT Jamshedpur (B.Tech CSE - 84.6%)</text>
    </g>

    <!-- Subjects Table -->
    <g transform="translate(80, 350)">
      <rect x="0" y="0" width="690" height="40" fill="#0f172a"/>
      <text x="30" y="25" font-size="13" font-weight="700" fill="#ffffff">SUB CODE</text>
      <text x="150" y="25" font-size="13" font-weight="700" fill="#ffffff">SUBJECT TITLE</text>
      <text x="420" y="25" font-size="13" font-weight="700" fill="#ffffff">MARKS (100)</text>
      <text x="580" y="25" font-size="13" font-weight="700" fill="#ffffff">GRADE</text>

      <!-- Row 1 -->
      <rect x="0" y="40" width="690" height="36" fill="#f8fafc"/>
      <text x="30" y="64" font-size="13" font-weight="600">301</text>
      <text x="150" y="64" font-size="13" font-weight="700">ENGLISH CORE</text>
      <text x="440" y="64" font-size="13" font-weight="800" fill="#047857">88</text>
      <text x="600" y="64" font-size="13" font-weight="800">A1</text>

      <!-- Row 2 -->
      <rect x="0" y="76" width="690" height="36" fill="#ffffff"/>
      <text x="30" y="100" font-size="13" font-weight="600">041</text>
      <text x="150" y="100" font-size="13" font-weight="700">MATHEMATICS</text>
      <text x="440" y="100" font-size="13" font-weight="800" fill="#047857">91</text>
      <text x="600" y="100" font-size="13" font-weight="800">A1</text>

      <!-- Row 3 -->
      <rect x="0" y="112" width="690" height="36" fill="#f8fafc"/>
      <text x="30" y="136" font-size="13" font-weight="600">042</text>
      <text x="150" y="136" font-size="13" font-weight="700">PHYSICS</text>
      <text x="440" y="136" font-size="13" font-weight="800" fill="#047857">85</text>
      <text x="600" y="136" font-size="13" font-weight="800">A2</text>

      <!-- Row 4 -->
      <rect x="0" y="148" width="690" height="36" fill="#ffffff"/>
      <text x="30" y="172" font-size="13" font-weight="600">043</text>
      <text x="150" y="172" font-size="13" font-weight="700">CHEMISTRY</text>
      <text x="440" y="172" font-size="13" font-weight="800" fill="#047857">84</text>
      <text x="600" y="172" font-size="13" font-weight="800">A2</text>

      <!-- Row 5 -->
      <rect x="0" y="184" width="690" height="36" fill="#f8fafc"/>
      <text x="30" y="208" font-size="13" font-weight="600">083</text>
      <text x="150" y="208" font-size="13" font-weight="700">COMPUTER SCIENCE</text>
      <text x="440" y="208" font-size="13" font-weight="800" fill="#047857">96</text>
      <text x="600" y="208" font-size="13" font-weight="800">A1</text>
    </g>

    <!-- Overall Result -->
    <g transform="translate(80, 620)">
      <rect x="0" y="0" width="690" height="70" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
      <text x="30" y="42" font-size="16" font-weight="800" fill="#166534">RESULT: PASSED IN FIRST DIVISION WITH DISTINCTION</text>
      <text x="560" y="42" font-size="18" font-weight="900" fill="#15803d">AGGREGATE: 88.8%</text>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 6. Bank Passbook DBT Mandate
function generateBankPassbookSvg(mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 600" width="850" height="600" style="background:#ffffff; font-family:system-ui, sans-serif;">
    <rect x="20" y="20" width="810" height="560" rx="16" fill="#ffffff" stroke="#0284c7" stroke-width="4"/>
    
    <!-- Bank Header -->
    <g transform="translate(50, 70)">
      <circle cx="30" cy="20" r="22" fill="#0369a1"/>
      <text x="65" y="18" font-size="22" font-weight="900" fill="#0369a1">STATE BANK OF INDIA</text>
      <text x="65" y="38" font-size="13" font-weight="600" fill="#475569">Ranchi Main Branch, Court Road, Jharkhand • IFSC: SBIN0001234</text>
    </g>

    <line x1="50" y1="120" x2="800" y2="120" stroke="#e2e8f0" stroke-width="2"/>

    <g transform="translate(60, 160)" font-size="15">
      <text x="0" y="30" font-weight="600" fill="#64748b">Account Holder:</text>
      <text x="200" y="30" font-weight="800" fill="#0f172a">SANJAY KUMAR</text>

      <text x="0" y="70" font-weight="600" fill="#64748b">Savings A/c Number:</text>
      <text x="200" y="70" font-family="monospace" font-weight="800" fill="#0369a1">${mask}</text>

      <text x="0" y="110" font-weight="600" fill="#64748b">Customer CIF No:</text>
      <text x="200" y="110" font-family="monospace" font-weight="700" fill="#334155">88319024510</text>

      <text x="0" y="150" font-weight="600" fill="#64748b">Aadhaar Seeding (NPCI):</text>
      <text x="200" y="150" font-weight="800" fill="#15803d">ACTIVE &amp; ENABLED FOR DIRECT BENEFIT TRANSFER (DBT)</text>
    </g>

    <!-- Bank Stamp -->
    <g transform="translate(620, 240)">
      <circle cx="60" cy="60" r="50" fill="none" stroke="#dc2626" stroke-width="2.5"/>
      <text x="60" y="55" font-size="11" font-weight="800" fill="#dc2626" text-anchor="middle">SBI RANCHI</text>
      <text x="60" y="72" font-size="10" font-weight="700" fill="#dc2626" text-anchor="middle">NPCI SEEDED</text>
    </g>

    <rect x="50" y="470" width="750" height="60" rx="10" fill="#f0f9ff" stroke="#bae6fd"/>
    <text x="425" y="506" font-size="14" font-weight="700" fill="#0284c7" text-anchor="middle">
      PFMS &amp; Aadhaar Payment Bridge System (APBS) Ready for Central MoTA Grants
    </text>
  </svg>`;
  return svgToDataUrl(svg);
}

// 7. Swavlamban UDID Disability Card
function generateUdidCardSvg(mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 550" width="850" height="550" style="background:#ffffff; font-family:system-ui, sans-serif;">
    <rect x="20" y="20" width="810" height="510" rx="16" fill="#ffffff" stroke="#7c3aed" stroke-width="4"/>
    
    <g transform="translate(50, 65)">
      <circle cx="25" cy="20" r="20" fill="#7c3aed"/>
      <text x="60" y="18" font-size="20" font-weight="900" fill="#6d28d9">GOVERNMENT OF INDIA • SWAVLAMBAN CARD</text>
      <text x="60" y="38" font-size="13" font-weight="600" fill="#475569">Department of Empowerment of Persons with Disabilities (DEPwD)</text>
    </g>

    <line x1="50" y1="110" x2="800" y2="110" stroke="#e2e8f0" stroke-width="2"/>

    <g transform="translate(60, 150)">
      <rect x="0" y="10" width="140" height="180" rx="12" fill="#f3f4f6" stroke="#d1d5db"/>
      <circle cx="70" cy="70" r="35" fill="#9ca3af"/>
      <text x="70" y="150" font-size="11" font-weight="700" fill="#4b5563" text-anchor="middle">SANJAY KUMAR</text>

      <g transform="translate(170, 20)" font-size="15">
        <text x="0" y="25" font-weight="600" fill="#64748b">UDID Number:</text>
        <text x="180" y="25" font-family="monospace" font-weight="800" fill="#7c3aed">${mask}</text>

        <text x="0" y="65" font-weight="600" fill="#64748b">Name:</text>
        <text x="180" y="65" font-weight="800" fill="#111827">SANJAY KUMAR</text>

        <text x="0" y="105" font-weight="600" fill="#64748b">Disability Type:</text>
        <text x="180" y="105" font-weight="700" fill="#111827">Locomotor Disability (40%)</text>

        <text x="0" y="145" font-weight="600" fill="#64748b">Issuing Hospital:</text>
        <text x="180" y="145" font-weight="600" fill="#374151">RIMS Medical Board, Ranchi</text>
      </g>
    </g>

    <rect x="50" y="430" width="750" height="50" rx="8" fill="#faf5ff" stroke="#e9d5ff"/>
    <text x="425" y="461" font-size="13" font-weight="700" fill="#7c3aed" text-anchor="middle">
      Special Conveyance &amp; Reader Allowance Authorized under MoTA ST Schemes
    </text>
  </svg>`;
  return svgToDataUrl(svg);
}

// 8. Generic Government Document Fallback
function generateGenericGovtCertificateSvg(title: string, mask: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 1100" width="850" height="1100" style="background:#ffffff; font-family:system-ui, sans-serif;">
    <rect x="25" y="25" width="800" height="1050" fill="#ffffff" stroke="#047857" stroke-width="4"/>
    <rect x="35" y="35" width="780" height="1030" fill="none" stroke="#10b981" stroke-width="1.5"/>

    <g transform="translate(425, 100)">
      <circle cx="0" cy="0" r="32" fill="#065f46"/>
      <text x="0" y="52" font-size="18" font-weight="800" fill="#065f46" text-anchor="middle">MINISTRY OF TRIBAL AFFAIRS</text>
      <text x="0" y="74" font-size="14" font-weight="600" fill="#475569" text-anchor="middle">NATIONAL TRIBAL SCHOLARSHIP PORTAL</text>
      <text x="0" y="110" font-size="22" font-weight="900" fill="#047857" text-anchor="middle">${title.toUpperCase()}</text>
      <text x="0" y="132" font-size="13" font-family="monospace" font-weight="700" fill="#64748b" text-anchor="middle">Document ID: ${mask}</text>
    </g>

    <line x1="80" y1="260" x2="770" y2="260" stroke="#e2e8f0" stroke-width="2"/>

    <g transform="translate(80, 310)" font-size="16" fill="#1e293b" style="line-height: 1.8;">
      <text x="0" y="0">This official statutory record has been verified and registered for beneficiary:</text>
      <text x="0" y="35" font-size="20" font-weight="800" fill="#047857">SANJAY KUMAR (ST-2026-JH-8831)</text>
      
      <g transform="translate(0, 80)">
        <rect x="0" y="0" width="690" height="120" rx="12" fill="#f0fdf4" stroke="#bbf7d0"/>
        <text x="30" y="40" font-size="15" font-weight="600" fill="#166534">Document Type:</text>
        <text x="180" y="40" font-size="16" font-weight="800" fill="#0f172a">${title}</text>
        <text x="30" y="80" font-size="15" font-weight="600" fill="#166534">Verification Status:</text>
        <text x="180" y="80" font-size="16" font-weight="800" fill="#047857">Statutory Verified &amp; Digitally Attested</text>
      </g>

      <text x="0" y="260">Certified for submission across Pre-Matric, Post-Matric, Top Class, and Overseas</text>
      <text x="0" y="290">Fellowship scholarship grant disbursements under Government of India norms.</text>
    </g>

    <g transform="translate(80, 830)">
      <rect x="10" y="10" width="120" height="120" fill="#f8fafc" stroke="#94a3b8"/>
      <text x="70" y="75" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">MoTA DSC STAMP</text>
      <g transform="translate(450, 40)">
        <text x="80" y="45" font-size="14" font-weight="800" fill="#0f172a" text-anchor="middle">Designated Nodal Officer</text>
        <text x="80" y="68" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">Ministry of Tribal Affairs</text>
      </g>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}
