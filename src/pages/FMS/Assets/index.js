import { useState, useMemo, useCallback } from "react";
import {
    Container, Row, Col, Card, CardBody, CardHeader,
    Badge, Button, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup, Label, FormFeedback,
} from "reactstrap";
import BreadCrumb from "@/components/Common/BreadCrumb";

const ACC_MAP = {
    "211": "Buildings",
    "215": "Other Structures",
    "221": "Office Equipment",
    "222": "Furniture & Fixtures",
    "223": "ICT Equipment",
    "224": "Communication Equipment",
    "229": "Other Machinery & Equip.",
    "233": "Medical Equipment",
    "235": "Sports Equipment",
    "241": "Transportation Equipment",
    "250": "Infrastructure Assets",
    "": "Unclassified",
};

const ACC_COLOR = {
    "211": "primary", "215": "info", "221": "warning",
    "222": "secondary", "223": "success", "224": "info",
    "229": "warning", "233": "danger", "235": "primary",
    "241": "dark", "250": "secondary", "": "secondary",
};

// [id, accountCode, article, description, propertyNo, uom, assetValue, qtyCard, qtyPhysical, shortage, location]
const RAW = [
    [1, "221", "Binding Machine", "Binding Machine, SN: E1804431C024", "19-I-10-054", "unit", 760714.29, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [2, "221", "Copier", "Sharp Multifunction Digital M:AR-6026N sn:63015497", "17-I-4-100", "unit", 104880.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [3, "221", "Copier", "Sharp MX-3050V full color Copier w/ Archiving System Digital Full Color MFP SN: 85063048 Sheet Paper Drawer SN:8E001837 Type:Desktop Engine Speed:A4 (", "19-I-4-109", "unit", 498000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 303 (DED-BCSSS Office)"],
    [4, "221", "Copier", "Digital Multi-Function Copier Machine M:MX-M315NV/CS12 SN:95012358", "20-I-4-119", "unit", 198880.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 307 (Legal Affair's Office)"],
    [5, "221", "Copier", "Copier APEOSPORT-IV 3065 S/N; 853287", "SEAG-1337", "unit", 80465.76, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 207 (BAC OFFICE)"],
    [6, "221", "Copier", "Kyocera Multi Function Laser Copier SN:VBM7Z00061", "18-I-4-106", "unit", 70000.0, 1, 1, 0, "Philsports-PHILSPADA (Donated already; for endorsement to Accounting Office)"],
    [7, "221", "Copier", "Color Copier Sharp M:MX-3051 SN:95086158", "19-I-4-116", "unit", 610880.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [8, "221", "Copier", "Color Copier Sharp M:MX-3051 SN:95086128", "19-I-4-117", "unit", 610880.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [9, "221", "Copier", "Colored 45057808 (Digital Copier) M:MX-2314N", "15-I-4-086", "unit", 158000.0, 1, 1, 0, "Philsports-Administrator's Office 2nd floor Room (206)"],
    [10, "221", "Copier", "Digital Multi Function Copier M:Sharp AR-6023NV SN:83005279", "18-I-4-105", "unit", 79880.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 405 (Comm. Olivia Coo Office)"],
    [11, "221", "Copier", "Develop Ineo + 281 Full Colour Multifunction SN: A^U9141000092 with document feeder SN: A6XYFWY1033248", "17-I-4-101", "unit", 190000.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 203 (DED-AFMS Office)"],
    [12, "221", "Copier", "Sharp Copier Multi-function production printer w/ finish function (full color) SN:55120369", "19-I-4-107", "sets", 3169642.85, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [13, "221", "Copier", "Sharp Multifunction Digital M:AR-6026N sn:53031726 / Top Cover M:ARRP11 sn:75054082 / Mobile Pedestal", "17-I-4-095 / A,B", "set", 104880.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Operation's Office)"],
    [14, "221", "Copier", "Risograph Machine RISO SF9390 SN:43160018", "18-I-4-102", "unit", 483000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [15, "221", "Copier", "Copier APEOSPORT-IV 3065 S/N; 853401", "SEAG-1336", "unit", 80465.76, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [16, "221", "Copier", "APEOS IV C5570R Full Color Copier, Printer Scanner SN:405821-6", "16-I-4-090", "unit", 239990.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [17, "221", "Copier", "Color Copier Sharp M:MX-3051 SN:95020629", "19-I-4-118", "unit", 610880.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 304 (Board Secretary Office)"],
    [18, "221", "Copier", "Copying Machine Multi-Function System Muratec M:MFX-2835R (28CPM) sn:01739-DC226520002030", "17-I-4-098", "unit", 101950.0, 1, 1, 0, "PSC CEBU"],
    [19, "221", "Copier", "Color Copier Machine, SHARP, S/N; 93002292", "SEAG-1407", "unit", 100857.6, 1, 1, 0, "RMSC-Property Office Storage"],
    [20, "221", "Copier", "Copier APEOSPORT-IV 3065 S/N; 853298", "SEAG-1334", "unit", 80465.76, 1, 1, 0, "RMSC-Property Office Storage"],
    [21, "221", "Copier", "Color Copier Machine, SHARP, S/N; 93002124", "SEAG-1404", "unit", 100857.6, 1, 1, 0, "RMSC-Dormitory Office"],
    [22, "221", "Copier", "Colored Multifunction Machine Model:Fuji Xerox Docu Print CM415AP SN:703759", "17-I-4-099", "unit", 95000.0, 1, 1, 0, "Philsports-MSAS Office"],
    [23, "221", "Copier", "Sharp Multi Function Portal Copier Machine M:AR-6026N sn:63015487", "16-I-4-091", "unit", 85012.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [24, "221", "Copier", "Color Copier Machine, SHARP, S/N; 83014916", "SEAG-1392", "unit", 100857.6, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [25, "221", "Copier", "Color Copier Machine, SHARP, S/N; 93002122", "SEAG-1405", "unit", 100857.6, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [26, "221", "Scanner", "Document Scanner Fuji Xerox Documate 4830 sn:61LTY70059", "17-I-4-093", "unit", 218050.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [27, "222", "Bed", "Matrimonial Bed w/ head board, steel", "99-XI-4-402", "unit", 58795.0, 1, 1, 0, "PSC Baguio Chairman's Quarter Room 4"],
    [28, "222", "Bed", "Wood Bed Frame Ref.#:WBF001", "19-XI-4-542", "unit", 50346.97, 1, 1, 0, "Philsports-Dorm F (206)"],
    [29, "222", "Bed", "Wood Bed Frame Ref.#:WBF002", "19-XI-4-543", "unit", 50346.97, 1, 1, 0, "Philsports-Dorm F (202)"],
    [30, "222", "Bed", "Wood Bed Frame Ref.#:WBF003", "19-XI-4-544", "unit", 50346.97, 1, 1, 0, "Philsports-Dorm F (203)"],
    [31, "222", "Bed", "Wood Bed Frame Ref.#:WBF004", "19-XI-4-545", "unit", 50346.97, 1, 1, 0, "Philsports-Dorm F (208)"],
    [32, "222", "Bed", "Wood Bed Frame Ref.#:WBF005", "19-XI-4-546", "unit", 50346.97, 1, 1, 0, "Philsports-Dorm F (205)"],
    [33, "222", "Bed", "Wood Bed Frame Ref.#:WBF006", "19-XI-4-547", "unit", 50346.97, 1, 1, 0, "Philsports-Dorm F (104)"],
    [34, "222", "Bed", "Wood Bed Frame Ref.#:WBF007", "19-XI-4-548", "unit", 50346.97, 1, 1, 0, "Philsports-Dorm H 3rd Floor"],
    [35, "222", "Bed", "Wood Bed Frame Ref.#:WBF008", "19-XI-4-549", "unit", 50346.97, 1, 1, 0, "Philsports-MSAS Building "],
    [36, "222", "Bed", "Kings Bed Frame and Mattress", "2025-XI-4-970", "unit", 68635.0, 1, 1, 0, "PSC Baguio, Chairman's Room"],
    [37, "222", "Chair", "Laz-z-boy 10T-512 Pinnancle Chaise Reclina Rokker Recliner, in leather match color storm", "16-I-7-1765", "unit", 50950.0, 1, 1, 0, "Philsports-Bldg A. Ground Floor Room 106 (Chairman's Office)"],
    [38, "222", "Movable Filing Cabinet", "Movable Filing Cabinet,2-bay single-face fixed,2-bay single-face movable,2-bay double face movable wheels of filing cabinet", "2019-I-5-510", "lot", 326718.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [39, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS001/ABC", "19-II-9-1069", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (203)"],
    [40, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS002/ABC", "19-II-9-1070", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (204)"],
    [41, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS003/ABC", "19-II-9-1071", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (202)"],
    [42, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS004/ABC", "19-II-9-1072", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (201)"],
    [43, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS005/ABC", "19-II-9-1073", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (208)"],
    [44, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS006/ABC", "19-II-9-1074", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (205)"],
    [45, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS007/ABC", "19-II-9-1075", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (206)"],
    [46, "222", "Sofa set", "Color: Gray Sofa Set (1) 3 Seater, (1) 2 Seater, (1) Footrest & (1) Center Table Ref. #: LRS008/ABC", "19-II-9-1076", "set", 50346.97, 1, 1, 0, "Philsports-Dorm F (207)"],
    [47, "222", "Stand", "8 bar storing stand double sided", "99-XI-3-180", "unit", 119106.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [48, "222", "Table", "Conference Table", "20-I-6-1111", "unit", 57800.0, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 406 (PSI Office)"],
    [49, "222", "Table", "Back Table", "10-I-6-1026", "unit", 70000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [50, "222", "Table", "Conference Table, Section Design", "10-I-6-1031", "unit", 105000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [51, "222", "Table", "Executive Table", "19-I-6-1096", "unit", 128980.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [52, "222", "Table", "Small Reception Table Entrance w/ Decorative Light Dimension:0.8m W x .75m Working Table, Counter Height: 1.2M", "19-I-6-1089", "unit", 55000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Entrance Gate)"],
    [53, "222", "Table", "Small Reception Table Entrance w/ Decorative Light Dimension:0.8m W x .75m Working Table, Counter Height: 1.2M", "19-I-6-1090", "unit", 55000.0, 1, 1, 0, "RMSC- In front of Athlete's Dining Hall Cafeteria"],
    [54, "222", "Table", "Small Reception Table Entrance w/ Decorative Light Dimension:0.8m W x .75m Working Table, Counter Height: 1.2M", "19-I-6-1091", "unit", 55000.0, 1, 1, 0, "RMSC-Admin Building 2nd Floor Hallway"],
    [55, "222", "Table", "Medium Reception Table Entrance w/ Decorative Light Dimension:2.0m W x .75m Working Table, Counter Height: 1.2M", "19-I-6-1092", "unit", 65000.0, 1, 1, 0, "RMSC-Admin Building 4th Floor Hallway"],
    [56, "222", "Table", "Large Reception Table Entrance w/ Decorative Light Dimension:2.0m W x .75m Working Table, Counter Height: 1.2M", "19-I-6-1093", "unit", 75000.0, 1, 1, 0, "RMSC-Operation / Admin Bldg. Lobby"],
    [57, "222", "Table", "Executive Table 90x 2.0x76HT", "10-I-6-1025", "unit", 98000.0, 1, 1, 0, "Philsports-Bldg A. Ground Floor Room 106 (Chairman's Office)"],
    [58, "222", "Table", "Executive Table, Brown", "2010-I-6-1046", "unit", 98000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [59, "222", "Workstation", "Workstation Desk, 4 seater, color:Gray & Blue", "19-I-6-1097", "lot", 168880.0, 1, 1, 0, "Philsports-Bldg. A 2nd Floor Room 202 (ISU Office)"],
    [60, "222", "Brass Plate", "Special PSC brass plate for Main Lobby ", "24-I-6-1114", "unit", 96525.0, 1, 1, 0, "RMSC-Property Office Storage "],
    [61, "222", "Partition", "Modular partitions for workshop & computer room ", "24-I-6-1115", "set", 0.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [62, "222", "Partition", "Modular partition for computer table ", "24-I-6-1120", "set", 408703.44, 1, 1, 0, "RMSC-Admin BLDG 4th Floor Room 401 (Chairman's Office)"],
    [63, "222", "Partition", "L-Type Office Table ", "2025-I-6-1122", "unit", 62500.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [64, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1123", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [65, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1124", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [66, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1125", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [67, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1126", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [68, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1127", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [69, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1128", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [70, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1129", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [71, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1130", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [72, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1131", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [73, "222", "Partition", "L-Type Work Station with Side Table and Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1132", "unit", 104000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [74, "222", "Partition", "3 Seater Workstation with Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1133", "unit", 125000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [75, "222", "Partition", "3 Seater Workstation with Pedestal Cabinet / Color: Charcoal Gray", "2025-I-6-1134", "unit", 125000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (NSA Office)"],
    [76, "222", "Logo", "PSC logo 24 inch diameter, gauge 18, Building marker 24x30 inc x 1 inch ", "24-I-6-1113", "unit", 84582.5, 1, 1, 0, "RMSC-Admin Bldg. Lobby Ground Floor"],
    [77, "222", "Bed", "Hydraulic bed", "No Property #", "unit", 609400.0, 2, 2, 0, "Maybunga Warehouse (Defective/Disposal)"],
    [78, "222", "Table", "Conference table 12 seater oval type 340x120x750 w/o wire management include 12 chair executive leather,star base,castre wheel with gaslits oer c", "2019-I-6-1095", "set", 115000.0, 1, 1, 0, "Philsports-2nd Floor Dining Hall"],
    [79, "222", "Signage", "Signage & logos at PSI Campus ", "No Property #", "lot", 89800.0, 1, 1, 0, "Philsports -Property Office Storage"],
    [80, "222", "Sofa", "Sofa 3 seater loose Cushion back & sert", "10-II-9-1050", "unit", 50000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [81, "223", "Access Point", "Point to Point Wifi Access Device 5 GHZ Nanobeam AC, Gen2 with POE Injector M: NBE-55AC-GEN2 SN:B4FBE45A2FEE, SN:B4FBE45A2D5A", "19-I-3-1623 up to 1624", "set", 60000.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [82, "223", "Access Point", "Point to Point Wifi Access Device 5 GHZ Nanobeam AC, Gen2 with POE Injector M: NBE-55AC-GEN2 SN:B4FBE45A2FDE, SN:B4FBE45A2D5B", "19-I-3-1625 up to 1626", "set", 60000.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [83, "223", "Desktop Computer", "Desktop Computer Acer w/ Nvidia GT1030 ASPIRE TC-860,SN:", "SEAG-0007", "unit", 68387.1, 1, 1, 0, "PSC Baguio-Admin"],
    [84, "223", "Desktop Computer Set", "Acer Veriton X4660G intel Core i7 8th Gen SN:DTVROSP011830076C09600 / Monito 21.5\" SN:DC1121100782607146K701 w/ Mouse & Keyboard", "19-I-3-1650 / A", "set", 57999.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [85, "223", "Desktop Computer Set", "Acer Veriton X4660G intel Core i7 8th Gen SN:DTVROSP011830076859600 / Monito 21.5\" SN:DC11211007826071B9K701 w/ Mouse & Keyboard", "19-I-3-1651 / A", "set", 57999.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [86, "223", "Desktop Computer Set", "Acer Veriton X4660G intel Core i7 8th Gen SN:DTVROSP011830076BB9600 / Monito 21.5\" SN:DC1121100782606F14K701 w/ Mouse & Keyboard", "19-I-3-1652 / A", "set", 57999.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [87, "223", "Desktop Computer Set", "Apple iMAC Retina 5K 27\" , 8GB, 1TB, Yosemite SN: C02SD1ABGG73 / with Keyboad / Mouse , Power Cord w/ universal Adaptor", "16-I-3-1301 / A,B", "set", 100000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 303 (DED-BCSSS Office)"],
    [88, "223", "Desktop Computer Set", "Desk Frame E-170 Core i7-7700 sn:U7QW422903416 / Monitor Xintrix WFP2401 LED 24\" sn:16AA3003-004954 / Keyboard & Mouse Xintrix", "17-I-3-1352 / A,B", "set", 52075.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [89, "223", "Desktop Computer Set", "ASUS ROG GL12CM GTX Intel Core i7-8700K SN:JBPDLG00066646C / Monitor ASUS XG27VQ 27\" SN:GSQJBHA001877 / ASUS Keyboard & Mouse", "19-I-3-1629", "set", 133700.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [90, "223", "Desktop Computer Set", "ASUS ROG GL12CM GTX Intel Core i7-8700K SN:JBPDLG00066346F / Monitor ASUS XG27VQ 27\" SN:GSQJBHA001897 / ASUS Keyboard & Mouse", "19-I-3-1630", "set", 133700.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [91, "223", "Desktop Computer Set", "Desk Frame E-170 Core i7-7700 sn:M7TL229901561/ Monitor Xintrix WFP2401 LED 24\" sn:16AA3003-00462J / Keyboard & Mouse Xintrix", "17-I-3-1350 / A,B", "set", 52075.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [92, "223", "Desktop Computer Set", "Desk Frame E-170 Core i7-7700 sn:U7QW422903453 / Monitor Xintrix WFP2401 LED 24\" sn:172A3002-004877 / Keyboard & Mouse Xintrix", "17-I-3-1351 / A,B", "set", 52075.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [93, "223", "Desktop Computer Set", "Desk Frame E-170 Core i7-7700 sn:U7QW422904154 / Monitor Xintrix WFP2401 LED 24\" sn:172A3002-004866 / Keyboard & Mouse Xintrix", "17-I-3-1354 / A,B", "set", 52075.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [94, "223", "Desktop Computer Set", "ASUS ROG Strix GL Intel Core i7-8700K SN:J9PDCG001811385 / Monitor ASUS XG27VQ 27\" SN:J6LMAS002777 / ASUS Keyboard & Mouse", "18-I-3-1591 / A,B", "set", 180000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [95, "223", "Desktop Computer Set", "ASUS ROG Strix GL Intel Core i7-8700K SN:J9PDCG001825389 / Monitor ASUS XG27VQ 27\" SN:J6LMAS002784 / ASUS Keyboard & Mouse", "18-I-3-1592 / A,B", "set", 180000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [96, "223", "Desktop Computer Set", "Apple iMAC Intel Core i5 Quad Core SN:C02N30A9F8J3", "14-I-3-1184", "set", 76000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [97, "223", "Desktop Computer Set", "Apple IMAC Model:MK462ZP/A sn:SC02SV2SQGG7J w/ Keyboard & Mouse", "17-I-3-1379 / A", "set", 93990.0, 1, 1, 0, "PSC-CEBU"],
    [98, "223", "Desktop Computer Set", "Acer Aspire Desktop TC780 intel Core i7, 8gb, 1tb HDD, Nvidia GTX 745 4gb SN:DTB89SP0037250106D3000 / Monitor 23\" Acer LED M:R230H SN:MMT4ASS001710000", "17-I-3-1386 / A,B", "set", 58000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [99, "223", "Desktop Computer Set", "Desktop Computer Intel Core i7-8700 Proc SN:ZZNNH4ZK400829Z / Monitor 24\" / Keyboard Mouse (USB)", "19-I-3-1633 / A,B", "unit", 69999.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [100, "223", "Desktop Computer Set", "Desktop Computer Intel Core i7-8700 Proc SN:ZZNNH4ZM104832D / Monitor 24\" / Keyboard Mouse (USB)", "19-I-3-1634 / A,B", "unit", 69999.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [101, "223", "Desktop Computer Set", "Desktop Computer Intel Core i7-8700 Proc SN:ZZNNH4ZK401808B / Monitor 24\" / Keyboard Mouse (USB)", "19-I-3-1635 / A,B", "unit", 69999.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [102, "223", "Firewall", "Firewall Device / Application True Layer 7 Firewall, Treat Prevention (AV,AS,IPS) URL Filtering, Application Visibility and Control, High Availability", "18-I-3-1408", "lot", 983000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [103, "223", "Firewall", "Fortinet Firewall, Fortigate FG-401E 18xGE RJ45 ports", "2022-I-3-1704", "unit", 520000.0, 1, 1, 0, "Philsports-Bldg. A 2nd Floor Room 202 (ISU Office)"],
    [104, "223", "Laptop Computer", "Macbook Pro 13 inch Intel Core i5, 256gb Model:A1706 SN:C1MHVHWQDTY3", "17-I-3-1326", "unit", 99168.88, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [105, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8478GXL", "SEAG-0230", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [106, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG849256W", "SEAG-0231", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [107, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8478GYT", "SEAG-0232", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [108, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8481K8Z", "SEAG-0233", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [109, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8481QQJ", "SEAG-0234", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [110, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG84901S2", "SEAG-0243", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [111, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG84903FD", "SEAG-0383", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [112, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG848073H", "SEAG-1021", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [113, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG84906S0", "SEAG-1023", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [114, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG848227S", "SEAG-0261", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [115, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84901SF", "SEAG-1113", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 304 (Board Secretary Office)"],
    [116, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8492D99", "SEAG-0214", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [117, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8492X1T", "SEAG-0235", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [118, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG84901WW", "SEAG-0029", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 406 (Comm. Walter Torres Office)"],
    [119, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8480GY8", "SEAG-0242", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [120, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478FP7", "SEAG-0403", "unit", 68640.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [121, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG848228K", "SEAG-0526", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [122, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8480TVN", "SEAG-0468", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [123, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478J8B", "SEAG-0469", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [124, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8481GW4", "SEAG-0471", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [125, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84823Q5", "SEAG-0507 / 19-I-3-1660", "unit", 68640.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [126, "223", "Laptop Computer", "Lenovo Thinkbook 14s Yoga Touch Screen, Intel Core i5-1135G7 SN: MP22GCE9", "22-I-3-1696", "unit", 82821.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 303 (DED-BCSSS Office)"],
    [127, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84825GL", "SEAG-0201", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [128, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8481N27", "SEAG-0247", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [129, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478J8N", "SEAG-0256", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [130, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478GFM", "SEAG-0486", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [131, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490177", "SEAG-1149", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [132, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451P3C", "SEAG-1345", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [133, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451Q2F", "SEAG-1374", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [134, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG849286G", "SEAG-0224", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [135, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8480K26", "SEAG-0246", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [136, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MMF", "SEAG-1353", "unit", 68640.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [137, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NLJ", "SEAG-1386", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [138, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480L17", "SEAG-0509 / 19-I-3-1662", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [139, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84902N4", "SEAG-1025", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 307 (Legal Affair's Office)"],
    [140, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8491FJY", "SEAG-1315", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 202 (Budget Office)"],
    [141, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451P5P", "SEAG-1364", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 307 (Legal Affair's Office)"],
    [142, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478HSD", "SEAG-0512 / 19-I-3-1665", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [143, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8478GKJ", "SEAG-0263", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [144, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478FNR", "SEAG-0030", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 207 (BAC OFFICE)"],
    [145, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478K12", "SEAG-0407", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [146, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG84906YN", "SEAG-1220", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [147, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG849215X", "SEAG-1267", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [148, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG84821W9", "SEAG-0394", "unit", 68640.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [149, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8480KM7", "SEAG-0473", "unit", 68640.0, 1, 1, 0, "Philsports-Administrator's Office Room 206"],
    [150, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8481R64", "SEAG-0240", "unit", 68640.0, 1, 1, 0, "Philsports-Administrator's Office Room 206"],
    [151, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478K7Q", "SEAG-0401", "unit", 68640.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [152, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8491HLF", "SEAG-0205", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [153, "223", "Laptop Computer", "Laptop Apple Macbook Pro 13\" w/ Charger M:A1708 SN:FVFXTEZMHV29", "19-I-3-1648", "unit", 97000.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [154, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84808B9", "SEAG-0039", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [155, "223", "Laptop Computer", "Lenovo Yoga 520-151KB, 14\" i7-8550U SN:1S81C800NSPHMP1EC2GU", "19-I-3-1621", "unit", 63900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [156, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478GN3", "SEAG-0097", "unit", 68640.0, 1, 1, 0, "RMSC- Emergency Response Team"],
    [157, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8492604", "SEAG-0202", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [158, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG8422R6", "SEAG-0257", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [159, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478K2B", "SEAG-0477", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [160, "223", "Laptop Computer", "HP Elitebook X360 1030 Intel Core i5-7200U G2 SN:5CG8480RVX", "SEAG-0504 / 19-I-3-1657", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [161, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451RKW", "SEAG-1368", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [162, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MY6", "SEAG-1382", "unit", 68640.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [163, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NBW", "SEAG-1384", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [164, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NL5", "SEAG-1428", "unit", 68640.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [165, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9431NBG", "SEAG-1341", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [166, "223", "Laptop Computer", "Macbook Pro sn:C02PJXTFVH7", "15-I-3-1236", "unit", 89990.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [167, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8483BGY", "SEAG-0470", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 207 (BAC OFFICE)"],
    [168, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84825RY", "SEAG-0412", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [169, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8491FLS", "SEAG-1245", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [170, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478K3M", "SEAG-0035", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [171, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84823PX", "SEAG-0262", "unit", 68640.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [172, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478HBC", "SEAG-0300", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 203 (DED-AFMS Office)"],
    [173, "223", "Laptop Computer", "Apple 12.9\" iPAD Pro WiFi 256GB Space Gray M:MTFL2LL/A SN:DLXZT2Z0KRG", "20-I-3-1679", "unit", 80952.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 203 (DED-AFMS Office)"],
    [174, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG849003M", "SEAG-0137", "unit", 68640.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [175, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG8492FGW", "SEAG-0524", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [176, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490J11", "SEAG-0090", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [177, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84903MW", "SEAG-1276", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [178, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451PJ8", "SEAG-1355", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [179, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N:5CG8478HJH", "SEAG-0254", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [180, "223", "Laptop Computer", "Laptop, Hp Pavilion x360 Touch Screen w/ Laptop Pen SN: 9CG208756C", "2022-I-3-1697", "unit", 53000.0, 1, 0, 1, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [181, "223", "Laptop Computer", "Laptop Computer Huawei, M:Matebook 14amd, S/N: 5YSBB20C19800996", "21-I-3-1693", "unit", 68000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [182, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG849017L", "SEAG-1057", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [183, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MPQ", "SEAG-1359", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 404 (Comm. Matthew Gaston Office)"],
    [184, "223", "Laptop Computer", "Notebook Acer S5-371-74HI Intel i7-6500.512gb sn:NXGCJSP002620000013400", "17-I-3-1331", "unit", 50215.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [185, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478K37", "SEAG-0225", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [186, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478FN0", "SEAG-0475", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [187, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8478GPS", "SEAG-0253", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [188, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490FWK", "SEAG-0113", "unit", 68640.0, 1, 1, 0, "Philsports-Engineering and Maintenance Office"],
    [189, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8480GGM", "SEAG-0213", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [190, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8478HHY", "SEAG-0372", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [191, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490BFM", "SEAG-1269", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [192, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN: 5CG8480H6M", "SEAG-0025", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [193, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8481JJ9", "SEAG-0227", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [194, "223", "Laptop Computer", "HP Elitebook x360 1030 G2 S/N: 5CG8480RS2", "SEAG-0404", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [195, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8480N1N", "SEAG-0478", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [196, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N:5CG8478HBH", "SEAG-0018", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [197, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8481L4L", "SEAG-0211", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [198, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8493WPS", "SEAG-0220", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [199, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478K5Y", "SEAG-0393", "unit", 68640.0, 1, 1, 0, "RMSC - Property Office "],
    [200, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480L6R", "SEAG-1075", "unit", 68640.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [201, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NQZ", "SEAG-1356", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [202, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451PQS", "SEAG-1376", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [203, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478J8P", "SEAG-0280", "unit", 68640.0, 1, 1, 0, "RMSC - Property Office "],
    [204, "223", "Laptop Computer", "HP Elitebook X360 1030 Intel Core i5-7200U G2 SN:5CG8480R3G", "SEAG-0503 / 19-I-3-1656", "unit", 68640.0, 1, 1, 0, "RMSC-Property Office"],
    [205, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG84900CQ", "SEAG-1161", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [206, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451P79", "SEAG-1340", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A Ground Floor Room 108 (Property Office)"],
    [207, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MP1", "SEAG-1347", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A Ground Floor Room 108 (Property Office)"],
    [208, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NN7", "SEAG-1362", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [209, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451PVT", "SEAG-1375", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [210, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NN0", "SEAG-1387", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [211, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NQ5", "SEAG-1390", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A Ground Floor Room 108 (Property Office)"],
    [212, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478K6W", "SEAG-0408", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [213, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480TLZ", "SEAG-0172", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [214, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84824R3", "SEAG-0244", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [215, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8481LM3", "SEAG-0250", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [216, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84825VQ", "SEAG-0395", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [217, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG84923XL", "SEAG-0522", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [218, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478K2C", "SEAG-0229", "unit", 68640.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [219, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478FPX", "SEAG-0135", "unit", 68640.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [220, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8482556", "SEAG-0417", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [221, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84823L7", "SEAG-1316", "unit", 68640.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [222, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451RL1", "SEAG-1361", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [223, "223", "Laptop Computer", "Acer Spin 5 SP513-54N-53X8 SN:", "20-I-3-1686", "unit", 57999.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [224, "223", "Laptop Computer", "Apple 12.9 inch iPAD Pro Wi-Fi 256GB Space Gray M:MTFL2LL/A SN:DLXC18DCK7RG", "20-I-3-1674", "unit", 80952.0, 1, 1, 0, "RMSC - Property Office "],
    [225, "223", "Laptop Computer", "Macbook Pro 13 inch Intel Core i5, 256gb Model:A1706 SN:SC02T6J2GGTFJ", "17-I-3-1330", "unit", 99168.88, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [226, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478HLZ", "SEAG-0040", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [227, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84821KT", "SEAG-0266", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [228, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8483CJ6", "SEAG-0251", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 304 (Board Secretary Office)"],
    [229, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG84821P6", "SEAG-0368", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [230, "223", "Laptop Computer", "Apple 12.9 inch iPAD Pro Wi-Fi 256GB Space Gray M:MTFL2LL/A SN:DLXC17Z8K7RG", "20-I-3-1680", "unit", 80952.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [231, "223", "Laptop Computer", "Apple MacBook Pro 15\" w/ Retina Laptop Complete Accessorries P/N: MJLQ2ZP/A SN:C02TJ649G8WN", "17-I-3-1406", "set", 116700.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [232, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490N5D", "SEAG-0897", "unit", 68640.0, 1, 1, 0, "PSC CEBU"],
    [233, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84902YN", "SEAG-1293", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [234, "223", "Laptop Computer", "Macbook 12 inch Model:MLH72PP/A SN:SC022TG07HGTHT w/ Charger", "17-I-3-1378", "unit", 69990.0, 1, 1, 0, "PSC CEBU"],
    [235, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451RKK", "SEAG-1383", "unit", 68640.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [236, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG8481GY2", "SEAG-1024", "unit", 68640.0, 1, 1, 0, "RMSC-MSAS Office"],
    [237, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84822C7", "SEAG-0400", "unit", 68640.0, 1, 1, 0, "RMSC-MSAS Office"],
    [238, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN: 5CG849004G", "SEAG-0027", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [239, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG848070F", "SEAG-0041", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [240, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480S0K", "SEAG-0497", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [241, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N:5CG84900YL", "SEAG-1200", "unit", 68640.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [242, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8490HZL", "SEAG-0031", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (OPERATION'S OFFICE)"],
    [243, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451P4G", "SEAG-1378", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [244, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451PQC", "SEAG-1381", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [245, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NP9", "SEAG-1360", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [246, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451N9L", "SEAG-1354", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [247, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8492FZ0", "SEAG-0212", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [248, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84807P1", "SEAG-0245", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [249, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490CHQ", "SEAG-0382", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [250, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84903C1", "SEAG-1194", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [251, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG84807DV", "SEAG-0203", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 404 (Comm. Matthew Gaston Office)"],
    [252, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN: 5CG849241P", "SEAG-0204", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [253, "223", "Laptop Computer", "Laptop Computer Yoga 520 Intel Core i7-8550U Display: 14\" full HD SN:81C80044PH", "19-I-3-1613", "unit", 69594.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [254, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NPH", "SEAG-1357", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 405 (Comm. Olivia Coo Office)"],
    [255, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MWR", "SEAG-1339", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [256, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG84822TJ", "SEAG-0260", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [257, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490CSH", "SEAG-1207", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [258, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478FTC", "SEAG-0044", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [259, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480VWL", "SEAG-1123", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [260, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG848071B", "SEAG-0515 / 19-I-3-1668", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [261, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8492B2M", "SEAG-1244", "unit", 68640.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [262, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478HFD", "SEAG-0216", "unit", 68640.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [263, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8480738", "SEAG-0218", "unit", 68640.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [264, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:5CG8490CG8", "SEAG-1240", "unit", 68640.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [265, "223", "Laptop Computer", "Notebook Acer S5-371-74HI Intel i7-6500.512gb sn:NXGCJSP002620013DF3400", "17-I-3-1332", "unit", 50215.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [266, "223", "Laptop Computer", "HP Envy X360 Laptop AMD RYZEN 5 w/ adapter & bag SN:8CG9205G22", "19-I-3-1653", "unit", 50000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [267, "223", "Laptop Computer", "HP Envy X360 Laptop AMD RYZEN 5 w/ adapter & bag SN:8CG9205G28", "19-I-3-1654", "unit", 50000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [268, "223", "Laptop Computer", "HP Elitebook X360 1030 Intel Core i5-7200U G2 SN:5CG8480HSJ", "SEAG-0505 / 19-I-3-1658", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [269, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478HH7", "SEAG-0371", "unit", 68640.0, 1, 1, 0, "PSC-Baguio"],
    [270, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG849215D", "SEAG-0210", "unit", 68640.0, 1, 1, 0, "RMSC-MSAS Office"],
    [271, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478K6L", "SEAG-0493", "unit", 68640.0, 1, 1, 0, "Philsports-MSAS Nurse Station"],
    [272, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MXK", "SEAG-1369", "unit", 68640.0, 1, 1, 0, "RMSC-MSAS Office"],
    [273, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8492BCG", "SEAG-0171", "unit", 68640.0, 1, 1, 0, "RMSC-MSAS Office"],
    [274, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NQB", "SEAG-1342", "unit", 68640.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [275, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MW6", "SEAG-1343", "unit", 68640.0, 1, 1, 0, "RMSC-MSAS REHAB"],
    [276, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451PGG", "SEAG-1344", "unit", 68640.0, 1, 1, 0, "RMSC-MSAS SPORTS MASSAGE"],
    [277, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MQ7", "SEAG-1358", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [278, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NQX", "SEAG-1388", "unit", 68640.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [279, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480DGC", "SEAG-0145", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [280, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480KNY", "SEAG-0508 / 19-I-3-1661", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [281, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451MLP", "SEAG-1380", "unit", 68640.0, 1, 1, 0, "RMSC-Property Office"],
    [282, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478J8W", "SEAG-0096", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [283, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8480RKX", "SEAG-0480", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [284, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478FQL", "SEAG-0516 / 19-I-3-1669", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [285, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84823VH", "SEAG-0238", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 202 (Budget Office)"],
    [286, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84825M9", "SEAG-0385", "unit", 68640.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [287, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478K23", "SEAG-0482", "unit", 68640.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [288, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8490CH5", "SEAG-0060", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 403 (Comm. Edward Hayco Office)"],
    [289, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480712", "SEAG-0065", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [290, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG84902KX", "SEAG-0118", "unit", 68640.0, 1, 1, 0, "Philsports-Building A. 2nd Floor, Room 208 (Engineering Office)"],
    [291, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478H90", "SEAG-0264", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [292, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478K2Z", "SEAG-0374", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [293, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478K5P", "SEAG-0375", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [294, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480DRJ", "SEAG-0376", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [295, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG848226J", "SEAG-0377", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [296, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8480CDT", "SEAG-0364", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [297, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG8478G3V", "SEAG-0259", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [298, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8478K5V", "SEAG-0411", "unit", 68640.0, 1, 1, 0, "RMSC-Athlete's Dining Hall Cafeteria (MSAS-Nutrition Unit)"],
    [299, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG84822K3", "SEAG-0223", "unit", 68640.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 406 (Comm. Walter Torres Office)"],
    [300, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN: 5CG849269T", "SEAG-0525", "unit", 68640.0, 1, 1, 0, "Within the custody of National Bureau of Investigation"],
    [301, "223", "Laptop Computer", "Apple 12.9\" iPAD Pro WiFi 256GB Space Gray M:MTFL2LL/A SN:DLXC16P5K7RG", "20-I-3-1675", "unit", 80952.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [302, "223", "Laptop Computer", "Apple 12.9 inch iPAD Pro Wi-Fi 256GB Space Gray M:MTFL2LL/A SN:DLXZN201K7RG", "20-I-3-1676", "unit", 80952.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [303, "223", "Laptop Computer", "Apple 12.9\" iPAD Pro WiFi 256GB Space Gray M:MTFL2LL/A SN:DLXZ64BUK7RG", "20-I-3-1678", "unit", 80952.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [304, "223", "Laptop Computer", "Macbook Pro 13 inch Intel Core i5, 256gb Model:A1706 SN:C17T2GTZGTFJ", "17-I-3-1324", "unit", 99168.88, 1, 1, 0, "RMSC-Property Office Storage"],
    [305, "223", "Laptop Computer", "Macbook Pro 13 inch Intel Core i5, 256gb Model:A1706 SN:C17T2GTTGTFJ", "17-I-3-1325", "unit", 99168.88, 1, 1, 0, "RMSC - Property Office "],
    [306, "223", "Nanobeam", "2 unit Ubiquiti 5 GHZ Nanobeam SN: 788A2DE4052F & 788A20E404AA", "18-I-3-1455 / A", "pair", 60000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [307, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,SN:S/N: 5CG9451NNO", "SEAG-1365", "unit", 68640.0, 1, 1, 0, "Philsports-Bldg A Ground Floor Room 108 (Property Office)"],
    [308, "223", "Printer", "ID Card Printer M Zebra SN:Z3J185200692", "19-I-3-1647", "unit", 165000.0, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 404 (PSI Office)"],
    [309, "223", "Printer", "Dual Sided ID Card Printer & Complete Supplies Package with ID Software, Enduro+", "19-I-3-1646", "set", 100995.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [310, "223", "Printer", "Large Format Printer", "20-I-3-1672A", "unit", 505000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [311, "223", "Printer", "Fargo HDP 5600 (300dpi) Dual sided Card Printer / Dual Sided Lamination Module with ID assist professional Software pro V0.7.0.5 (CD installer and USB", "20-I-3-1684", "set", 488250.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [312, "223", "Printer", "Fargo HDP 5600 (300dpi) Dual sided Card Printer / Dual Sided Lamination Module with ID assist professional Software pro V0.7.0.5 (CD installer and USB", "20-I-3-1683", "set", 488250.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [313, "223", "Scanner", "Scanner Panasonic M: KV-S1065C SN:E7231RB1047", "14-I-3-1183", "unit", 60000.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [314, "223", "Laptop", "Predator Helios Neo 16, SN: NHQNPSP0014210B5273400", "2024-I-3-1721", "unit", 84500.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [315, "223", "Scanner", "PANASONIC COLOR DOCUMENT SCANNER Model: KV-S5046H / S/N: G3802VM1061 Free: Adapter plug / w/ warranty certificate", "21-I-3-1691", "unit", 109950.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [316, "223", "Scanner", "PANASONIC COLOR DOCUMENT SCANNER Model: KV-S5046H / S/N: G3802VM1072 Free: Adapter plug / w/ warranty certificate", "21-I-3-1692", "unit", 109950.0, 1, 0, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [317, "223", "Scanner", "Panasonic-A3 High Volume Sheet Fed Scanner S/N:J3211VC1002", "21-I-3-1687", "unit", 308000.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [318, "223", "Scanner", "Panasonic-A3 High Volume Sheet Fed Scanner S/N:J3211VC1005", "21-I-3-1688", "unit", 308000.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [319, "223", "Scanner", "Canon Document Scanner with Ethernet and Wifi Connection, CANON DR-S150 S/N: JU409957", "21-I-3-1694", "unit", 51000.0, 1, 0, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [320, "223", "Scanner", "Scanner (ADF), Heavy Duty, Canon DR-M160 II/ Specs: Desktop Type Sheet Fed Scanner/ S/N: GXJ55091", "21-I-4-120", "unit", 73260.0, 1, 0, 0, "RMSC-Admin BLDG. 2nd Floor Room 202 (Budget Office)"],
    [321, "223", "Server Set", "DELL EMC Power Edge R440 PN: 21557 SN: 6W1V3Q31921052091 > 2 Unit Hard Drive (Installed) 2.4TB 10K RPM SAS 12GPS size: 2.5in Hot plug Hard Drive , CK ", "2022-V-2-087", "unit", 241500.0, 1, 0, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [322, "223", "Server Set", "DELL EMC Power Edge R440 PN: 21557 SN: 6W1V3Q31921052091 > 2 Unit Hard Drive (Installed) 2.4TB 10K RPM SAS 12GPS size: 2.5in Hot plug Hard Drive , CK ", "2022-V-2-088", "unit", 241500.0, 1, 0, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [323, "223", "Server Set", "Tower Server, Del EMC Power Edge T140", "2022-V-2-090", "unit", 84200.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [324, "223", "Server Set", "Server SYS-2029P-C1R Intel Xeon Gold 6130-16 Core Supermicro Server SN:A292103X9207941 w/ Window", "19-I-3-1620", "unit", 437000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [325, "223", "Switch", "Huawei S5731-H48T4XC (48\"10/10/100/1000 BASE- T Ports 4\"10GE SFP+Ports 1\" Expasion Slot w/ Out Power module)", "2022-V-2-086", "unit", 178294.42, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [326, "223", "Time Keeping System", "CPU ACER SN:DTB59SP0066320376F3000 / Monitor LCD S220HQL 21.5\" sn:MMLYKSS01061500C378511 / Keyboard & Mouse, Dell Inspire All in One Touch Intel Quad ", "17-I-3-1334 / A,B | 17-I-3-1335 / A | 17-I-3-1336 / A | 17-I-3-1337 | 17-I-3-1338 | 17-I-3-1339 | 17-I-3-1340", "set", 585000.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor (c/p Personnel Office)"],
    [327, "223", "Laptop Computer", "1 unit laptop ", "", "unit", 59999.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [328, "223", "Desktop Computer Set", "HP Pavilion 24-CA1015D AIO PC w/ Monitor, Keyboard And Mouse SN: 8CC2361PM1", "2023-I-3-1706", "unit", 77764.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [329, "223", "Desktop Computer Set", "HP Pavilion 24-CA1015D AIO PC w/ Monitor, Keyboard And Mouse SN: 8CC2361PPK", "2023-I-3-1707", "unit", 77764.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [330, "223", "Desktop Computer Set", "HP Pavilion 24-CA1015D AIO PC w/ Monitor, Keyboard And Mouse SN: 8CC2361PN4", "2023-I-3-1708", "unit", 77764.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [331, "223", "Desktop Computer Set", "HP Pavilion 24-CA1015D AIO PC w/ Monitor, Keyboard And Mouse SN: 8CC2361PL5", "2023-I-3-1709", "unit", 77764.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [332, "223", "Desktop Computer Set", "HP Pavilion 24-CA1015D AIO PC w/ Monitor, Keyboard And Mouse SN: 8CC2361PNT", "2023-I-3-1710", "unit", 77764.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [333, "223", "Desktop Computer Set", "HP Pavilion 24-CA1015D AIO PC w/ Monitor, Keyboard And Mouse SN: 8CC2361PKW", "2023-I-3-1711", "unit", 77764.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [334, "223", "Desktop Computer Set", "HP Pavilion 24-CA1015D AIO PC w/ Monitor, Keyboard And Mouse SN: 8CC2361PPC", "2023-I-3-1705", "unit", 77764.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [335, "223", "Desktop Computer Set", "Desktop Apple Imac SN:C0D2FQ0N9PN5V", "2023-I-3-1715", "unit", 85500.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [336, "223", "Desktop Computer Set", "Dell Inspiron 5410 SN:8G341Q3", "2023-I-3-1720", "unit", 55900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 404 (Comm. Matthew Gaston Office)"],
    [337, "223", "Desktop Computer Set", "HP All in one DT AI Model: 24-CR2004D, SN: 8CC52328PJ", "2025-I-3-1866", "unit", 68800.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [338, "223", "Desktop Computer Set", "HP All in one DT AI Model: 24-CR2004D, SN: 8CC52328PK", "2025-I-3-1867", "unit", 68800.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [339, "223", "Desktop Computer Set", "HP All in one DT AI Model: 24-CR2004D, SN: 8CC52328PP", "2025-I-3-1868", "unit", 68800.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [340, "223", "Desktop Computer Set", "Apple IMAC 24inch, 4.5 Retina Display", "2025-I-3-1869", "unit", 116799.99, 1, 1, 0, "RMSC-Property Office Storage"],
    [341, "223", "Computer", "CPU, Dell Precision 3680 Tower CTO, Windows 11 Pro", "2025-I-3-1870 to 2025-I-3-2040", "unit", 12889980.0, 171, 171, 0, "RMSC-Property Office Storage"],
    [342, "223", "Laptop Computer", "Apple Macbook Pro 13\" 8GB / 256 SSD Storage / Chip 8-Core CPU 10-Core GPU Color: Space Gray  SN: MYWYMTGJY2", "2023-I-3-1712", "unit", 78500.0, 1, 1, 0, "PSC CEBU"],
    [343, "223", "Laptop Computer", "Apple Macbook Pro 13\" 8GB / 256 SSD Storage / Chip 8-Core CPU 10-Core GPU Color: Space Gray  SN: G6NVT40VC4", "2023-I-3-1713", "unit", 78500.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [344, "223", "Laptop Computer", "Apple Macbook Pro 13\" 8GB / 256 SSD Storage / Chip 8-Core CPU 10-Core GPU Color: Space Gray  SN: MHW12QGFHR", "2023-I-3-1714", "unit", 78500.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 406 (Comm. Walter Torres Office)"],
    [345, "223", "Laptop Computer", "HP Pavilion 15-EG2058TX SN: 5CD3116PTP", "2023-I-3-1717", "unit", 68800.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 405 (Comm. Olivia Bong Coo Office)"],
    [346, "223", "Laptop Computer", "HP Pavilion 15-EG2058TX SN: 5CD3116PVN", "2023-I-3-1719", "unit", 68800.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 403 (Comm. Edward Hayco Office)"],
    [347, "223", "Laptop Computer", "HP Pavilion 15-EG2058TX SN: 5CD3116PVJ", "2023-I-3-1718", "unit", 68800.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 406 (Comm. Walter Torres Office)"],
    [348, "223", "Laptop Computer", "HP Pavilion 15-EG2058TX SN: 5CD3116PT9", "2023-I-3-1716", "unit", 68800.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 404 (Comm. Matthew Gaston Office)"],
    [349, "223", "Copier", "All-in-One Printer, Canon, IR-2224N, SN: 2SF04833", "2024-I-4-121", "unit", 71000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [350, "223", "Firewall", "Network Firewall, SN: FG200FT923927010", "2025-I-3-1722", "unit", 315665.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [351, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1MZN264", "2025-I-3-1731", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 406 (Comm. Walter Torres Office)"],
    [352, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 3MZN264", "2025-I-3-1732", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 406 (Comm. Walter Torres Office)"],
    [353, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 6LZN264", "2025-I-3-1733", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 406 (Comm. Walter Torres Office)"],
    [354, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: FGDJY74", "2025-I-3-1828", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [355, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: H9BJY74", "2025-I-3-1829", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [356, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: B9BJY74", "2025-I-3-1830", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [357, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: GCDJY74", "2025-I-3-1831", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [358, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: JGDJY74", "2025-I-3-1832", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [359, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1DDJY74", "2025-I-3-1833", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [360, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: BDDJY74", "2025-I-3-1834", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [361, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 3BDJY74", "2025-I-3-1835", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [362, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: DDDJY74", "2025-I-3-1836", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [363, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: BHDJY74", "2025-I-3-1837", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [364, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 9LZN264", "2025-I-3-1739", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 3rd Floor Room 307 (Legal Office)"],
    [365, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: DKZN264", "2025-I-3-1740", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 3rd Floor Room 307 (Legal Office)"],
    [366, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: JKZN264", "2025-I-3-1741", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 3rd Floor Room 307 (Legal Office)"],
    [367, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: BCDJY74", "2025-I-3-1759", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 303 (DED-BCSSS Office)"],
    [368, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: C8JFY74", "2025-I-3-1760", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 303 (DED-BCSSS Office)"],
    [369, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 59JFY74", "2025-I-3-1776", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [370, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1FDJY74", "2025-I-3-1777", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [371, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: C7BJY74", "2025-I-3-1778", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [372, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: H8HV264", "2025-I-3-1728", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 403 (Comm. Edward Hayco Office)"],
    [373, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: BLZN264", "2025-I-3-1729", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 403 (Comm. Edward Hayco Office)"],
    [374, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: JLZN264", "2025-I-3-1730", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 403 (Comm. Edward Hayco Office)"],
    [375, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: CGDJY74", "2025-I-3-1798", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [376, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: F9DJY74", "2025-I-3-1799", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [377, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 4MZN264", "2025-I-3-1742", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 207 (BAC OFFICE)"],
    [378, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: CFDJY74", "2025-I-3-1848", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 207 (BAC OFFICE)"],
    [379, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: C9DJY74", "2025-I-3-1815", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [380, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 2CDJY74", "2025-I-3-1816", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [381, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 16JFY74", "2025-I-3-1817", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [382, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 4DDJY74", "2025-I-3-1818", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [383, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: DGDJY74", "2025-I-3-1819", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 306 (Travel Office)"],
    [384, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: CDBJY74", "2025-I-3-1772", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Operation's Office)"],
    [385, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: FCDJY74", "2025-I-3-1824", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Operation's Office)"],
    [386, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: D8JFY74", "2025-I-3-1825", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Operation's Office)"],
    [387, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: B9DJY74", "2025-I-3-1827", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Operation's Office)"],
    [388, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 9DDJY74", "2025-I-3-1811", "unit", 73900.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [389, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: J5JFY74", "2025-I-3-1812", "unit", 73900.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [390, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: GFDJY74", "2025-I-3-1813", "unit", 73900.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [391, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 76JFY74", "2025-I-3-1814", "unit", 73900.0, 1, 1, 0, "RMSC-Dormitory Office"],
    [392, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: BBDJY74", "2025-I-3-1797", "unit", 73900.0, 1, 1, 0, "RMSC-Property Office"],
    [393, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: CLZN264", "2025-I-3-1752", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [394, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: DLZN264", "2025-I-3-1753", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Accounting Office)"],
    [395, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: DDBJY74", "2025-I-3-1791", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [396, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: JCDJY74", "2025-I-3-1792", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [397, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 3FDJY74", "2025-I-3-1793", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [398, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 68BJY74", "2025-I-3-1794", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [399, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 9BJFY74", "2025-I-3-1795", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [400, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 3LZN264", "2025-I-3-1754", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 202 (Budget Office)"],
    [401, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: D7BJY74", "2025-I-3-1755", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 202 (Budget Office)"],
    [402, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 4BDJY74", "2025-I-3-1756", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 202 (Budget Office)"],
    [403, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 5DDJY74", "2025-I-3-1757", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 202 (Budget Office)"],
    [404, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: DHDJY74", "2025-I-3-1773", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [405, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: G6JFY74", "2025-I-3-1774", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [406, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1BDJY74", "2025-I-3-1775", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [407, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: FHDJY74", "2025-I-3-1801", "unit", 73900.0, 1, 1, 0, "Philsports-Building A. 2nd Floor, Room 208 (Engineering Office)"],
    [408, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 9CBJY74", "2025-I-3-1842", "unit", 73900.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [409, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: JDDJY74", "2025-I-3-1843", "unit", 73900.0, 1, 1, 0, "Philsports-Bldg A, 4th Floor Room 406 (PSI Office)"],
    [410, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 6DDJY74", "2025-I-3-1789", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [411, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: HDDJY74", "2025-I-3-1790", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 204 (Procurement Office)"],
    [412, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: HLZN264", "2025-I-3-1734", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [413, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 5LZN264", "2025-I-3-1735", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [414, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 4LZN264", "2025-I-3-1737", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [415, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: FLZN264", "2025-I-3-1738", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [416, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 8DDJY74", "2025-I-3-1758", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [417, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1FBJY74", "2025-I-3-1844", "unit", 73900.0, 1, 1, 0, "Philsports-Administrator's Office Room 206"],
    [418, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: JDBJY74", "2025-I-3-1845", "unit", 73900.0, 1, 1, 0, "Philsports-Administrator's Office Room 206"],
    [419, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 2DDJY74", "2025-I-3-1846", "unit", 73900.0, 1, 1, 0, "Philsports-Administrator's Office Room 206"],
    [420, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 96JFY74", "2025-I-3-1847", "unit", 73900.0, 1, 1, 0, "Philsports-Administrator's Office Room 206"],
    [421, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: BCBJY74", "2025-I-3-1839", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [422, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: H8BJY74", "2025-I-3-1840", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [423, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: H5JFY74", "2025-I-3-1762", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [424, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 7DBJY74", "2025-I-3-1841", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (IGS Office)"],
    [425, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 67HV264", "2025-I-3-1736", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [426, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: G9BJY74", "2025-I-3-1779", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [427, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 99BJY74", "2025-I-3-1780", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [428, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: D9BJY74", "2025-I-3-1781", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [429, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: H7BJY74", "2025-I-3-1782", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [430, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 47FJY74", "2025-I-3-1783", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [431, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 4BBJY74", "2025-I-3-1784", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [432, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 8DBJY74", "2025-I-3-1785", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [433, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 4FDJY74", "2025-I-3-1786", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 205 (Personnel Office)"],
    [434, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1LZN264", "2025-I-3-1743", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [435, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 2LZN264", "2025-I-3-1744", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [436, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: GKZN264", "2025-I-3-1745", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [437, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: HKZN264", "2025-I-3-1746", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [438, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 88BJY74", "2025-I-3-1764", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [439, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 37HV264", "2025-I-3-1723", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 405 (Comm. Olivia Bong Coo Office)"],
    [440, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 28HV264", "2025-I-3-1724", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 405 (Comm. Olivia Bong Coo Office)"],
    [441, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: J7HV264", "2025-I-3-1725", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 405 (Comm. Olivia Bong Coo Office)"],
    [442, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 2BHV264", "2025-I-3-1726", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 404 (Comm. Matthew Gaston Office)"],
    [443, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: D8HV264", "2025-I-3-1727", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 404 (Comm. Matthew Gaston Office)"],
    [444, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 3HDJY74", "2025-I-3-1800", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [445, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 78JFY74", "2025-I-3-1802", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [446, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1HDJY74", "2025-I-3-1849", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [447, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 5HDJY74", "2025-I-3-1850", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [448, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 4HDJY74", "2025-I-3-1851", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [449, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: B6JFY74", "2025-I-3-1852", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [450, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: HCDJY74", "2025-I-3-1853", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [451, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: F5JFY74", "2025-I-3-1854", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [452, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: DCBJY74", "2025-I-3-1855", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [453, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 7LZN264", "2025-I-3-1747", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [454, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: GLZN264", "2025-I-3-1748", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [455, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 8LZN264", "2025-I-3-1749", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [456, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: FKZN264", "2025-I-3-1750", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [457, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 2MZN264", "2025-I-3-1751", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [458, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 3CDJY74", "2025-I-3-1803", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [459, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 7DDJY74", "2025-I-3-1804", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [460, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 6CBDJY74", "2025-I-3-1805", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [461, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: BGDDJY74", "2025-I-3-1806", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [462, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 8CDJY74", "2025-I-3-1807", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [463, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 7CDJY74", "2025-I-3-1808", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [464, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 9HJY74", "2025-I-3-1809", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [465, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: CHDJY74", "2025-I-3-1810", "unit", 73900.0, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [466, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 56JFY74", "2025-I-3-1787", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [467, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 1CDJY74", "2025-I-3-1788", "unit", 73900.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 206 (Training and Development Office)"],
    [468, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 36JFY74", "2025-I-3-1761", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [469, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 17BJY74", "2025-I-3-1763", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [470, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 8HDJY74", "2025-I-3-1765", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [471, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: GBDJY74", "2025-I-3-1766", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [472, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: CDDJY74", "2025-I-3-1767", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [473, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 7HDJY74", "2025-I-3-1768", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [474, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 2GDJY74", "2025-I-3-1769", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [475, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: HBJFY74", "2025-I-3-1770", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [476, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: JBDJY74", "2025-I-3-1771", "unit", 73900.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [477, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 6HDJY74", "2025-I-3-1822", "unit", 73900.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [478, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 5DBJY74", "2025-I-3-1823", "unit", 73900.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [479, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 3DBJY74", "2025-I-3-1838", "unit", 73900.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [480, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: GDDJY74", "2025-I-3-1820", "unit", 73900.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [481, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 37JFY74", "2025-I-3-1821", "unit", 73900.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [482, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: 17JFY74", "2025-I-3-1826", "unit", 73900.0, 1, 1, 0, "PSC DAVAO"],
    [483, "223", "Laptop Computer", "Dell Inspiron 14 5440 C7, SN: FDDJY74", "2025-I-3-1796", "unit", 73900.0, 1, 1, 0, "Philsports-Admin Bldg. 2nd Floor Room 209 (Cashier's Office)"],
    [484, "223", "Laptop Computer", "Acer Predator Helios 16\" Gaming Laptop, Model: PH16-72-94UE, SN: NHQNXSP001449081FA7600", "2025-I-3-1856", "unit", 152400.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [485, "223", "Laptop Computer", "Acer Predator Helios 16\" Gaming Laptop, Model: PH16-72-94UE, SN: NHQNXSP0014490812C7600", "2025-I-3-1857", "unit", 152400.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [486, "223", "Laptop Computer", "Acer Predator Helios 16\" Gaming Laptop, Model: PH16-72-94UE, SN: NHQNXSP001451150E57600", "2025-I-3-1858", "unit", 152400.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [487, "223", "Laptop Computer", "Acer Predator Helios 16\" Gaming Laptop, Model: PH16-72-94UE, SN: NHQNXSP001451151457600", "2025-I-3-1859", "unit", 152400.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [488, "223", "Laptop Computer", "Acer Predator Helios 16\" Gaming Laptop, Model: PH16-72-94UE, SN: NHQNXSP001451151767600", "2025-I-3-1860", "unit", 152400.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [489, "223", "Laptop Computer", "Acer Predator Helios 16\" Gaming Laptop, Model: PH16-72-94UE, SN: NHQNXSP001451151F97600", "2025-I-3-1861", "unit", 152400.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [490, "223", "Laptop Computer", "Acer Predator Helios 16\" Gaming Laptop, Model: PH16-72-94UE, SN: NHQNXSP0014511AA887600", "2025-I-3-1862", "unit", 152400.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [491, "223", "Laptop Computer", "Apple Notebook Macbook Pro 14\", SN: 5YFFKW0XCD", "2025-I-3-1863", "unit", 119600.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 402 (Public Communication Office)"],
    [492, "223", "Laptop Computer", "Apple Notebook Macbook Pro 14\", SN: MJQ4NRJV4G", "2025-I-3-1864", "unit", 119600.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [493, "223", "Laptop Computer", "Apple Notebook Macbook Pro 14\", SN: J4QVX69CL6", "2025-I-3-1865", "unit", 119600.0, 1, 1, 0, "RMSC-Admin BLDG 4th floor Room 401 (Chairman's Office)"],
    [494, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG848086C", "SEAG-0037", "unit", 68640.0, 1, 1, 0, "Philsports-PHILSPADA (Donated already; for endorsement to Accounting Office)"],
    [495, "223", "Laptop Computer", "HP Elitebook x360 1030 G2,S/N: 5CG8480JWK", "SEAG-0047", "unit", 68640.0, 1, 1, 0, "Philsports-PHILSPADA (Donated already; for endorsement to Accounting Office)"],
    [496, "223", "Laptop Computer", "MacBook Air with PWD Access 13.3\" intel Core i5", "18-I-3-1589", "unit", 93900.0, 1, 1, 0, "Philsports-PHILSPADA (Donated already; for endorsement to Accounting Office)"],
    [497, "224", "Book", "Interactive 3D Anatomy Series Complete Human Anatomy (DVD)", "2024-III-1-001", "pc", 57321.0, 1, 1, 0, "Philsports-PSI Library"],
    [498, "229", "Intercom", "PABX system", "2022-V-2-089", "Unit", 1945500.0, 1, 1, 1, "RMSC-Admin Bldg. Lobby Ground Floor"],
    [499, "229", "Cellphone", "Apple iPhone 7 Plus 128gb / 3gb RAM SN:F2NT1URAHFYD IMEI/MEID:353812087136272 (Black)", "17-V-4-341", "unit", 51490.0, 1, 1, 0, "RMSC-Property Office"],
    [500, "233", "Medical Equipment", "Therasound machine, Richmar", "99-IX-451", "unit", 142216.0, 1, 1, 0, "PSC Baguio Clinic (Defective/For Disposal)"],
    [501, "233", "Medical Equipment", "Therapuetic Ultrasounds w/ Hands Free SN:058P0B010849", "19-IX-655", "unit", 1879575.02, 1, 1, 0, "PSC Baguio-MSAS"],
    [502, "233", "Medical Equipment", "Defibrillator SN: X09F412283", "10-IX-600", "unit", 195000.0, 1, 1, 0, "RMSC-MSAS Stock Room"],
    [503, "233", "Medical Equipment", "Automated External Defibrillator 500P w/ PAD Pak & Soft Carry Case SN:18B00005232", "19-IX-663", "unit", 237500.0, 1, 1, 0, "RMSC-MSAS Clinic"],
    [504, "233", "Medical Equipment", "Automated External Defibrillator 500P w/ PAD Pak & Soft Carry Case SN:18B00005231", "19-IX-664", "unit", 237500.0, 1, 1, 0, "RMSC-MSAS Clinic"],
    [505, "233", "Medical Equipment", "Automated External Defibrillator 500P w/ PAD Pak & Soft Carry Case SN:18B00005225", "19-IX-665", "unit", 237500.0, 1, 1, 0, "Philsports-MSAS Nurse Station"],
    [506, "233", "Medical Equipment", "Automated External Defibrillator 500P w/ PAD Pak & Soft Carry Case SN:18B00005230", "19-IX-666", "unit", 237500.0, 1, 1, 0, "PSC Baguio-MSAS"],
    [507, "233", "Medical Equipment", "Diagnostic Ultrasound M:STO180 SN:0231351328", "19-IX-656", "unit", 264315.24, 1, 1, 0, "Philsport-MSAS Operating Room Grd flr"],
    [508, "233", "Medical Equipment", "Diagnostic Ultrasound M:STO180 SN:0238672117", "19-IX-657", "unit", 264315.24, 1, 1, 0, "Philsports-MSAS P.T. Room Grd flr."],
    [509, "233", "Medical Equipment", "Diagnostic Ultrasound M:STO180 SN:0238063322", "19-IX-658", "unit", 264315.24, 1, 1, 0, "Philsport-MSAS Operating Room Grd flr"],
    [510, "233", "Medical Equipment", "Diagnostic Ultrasound M:STO180 SN:0238066562", "19-IX-659", "unit", 264315.24, 1, 1, 0, "Philsport-MSAS Operating Room Grd flr"],
    [511, "233", "Medical Equipment", "Shockwave M:BTL-600 SWT Topline SN:04400B006726", "19-IX-650", "unit", 1268750.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [512, "233", "Medical Equipment", "Shockwave M:BTL-600 SWT Topline SN:04400B007325", "19-IX-651", "unit", 1268750.0, 1, 1, 0, "PSC Baguio-MSAS Building"],
    [513, "233", "Medical Equipment", "Therapeutic High Intensity Laser M: BTL-6000 SN:04100B002787", "19-IX-647", "unit", 1522500.0, 1, 1, 0, "Philsports-MSAS Operating Room Grd flr."],
    [514, "233", "Medical Equipment", "Therapeutic High Intensity Laser M: BTL-6000 SN:04100B002774", "19-IX-648", "unit", 1522500.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [515, "233", "Medical Equipment", "C-Arm System Table (Multipurpose OR Table)", "19-IX-662", "unit", 1522500.0, 1, 1, 0, "RMSC-MSAS"],
    [516, "233", "Medical Equipment", "Therapuetic Ultrasounds w/ Hands Free SN:058P0B010943", "19-IX-652", "unit", 1879575.02, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [517, "233", "Medical Equipment", "Therapuetic Ultrasounds w/ Hands Free SN:058P0B010969", "19-IX-653", "unit", 1879575.02, 1, 1, 0, "Philsports-MSAS P.T. Room Grd flr."],
    [518, "233", "Medical Equipment", "Therapuetic Ultrasounds w/ Hands Free SN:058P0B011014", "19-IX-654", "unit", 1879575.02, 1, 1, 0, "Philsports-MSAS Operating Room Grd flr."],
    [519, "233", "Medical Equipment", "Targeted Radiofrequency Therapy M:BTL-6000 TR-Therapy Elite SN:04900B001541", "19-IX-645", "unit", 4313750.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [520, "233", "Medical Equipment", "Targeted Radiofrequency Therapy M:BTL-6000 TR-Therapy Elite SN:04900B001519", "19-IX-646", "unit", 4313750.0, 1, 1, 0, "Philsports-MSAS P.T. Room Grd flr."],
    [521, "233", "Medical Equipment", "Super Inductive System Elite M:BTL-6000 SN:09900B001357", "19-IX-649", "unit", 8627500.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [522, "233", "Medical Equipment", "C-Arm System Portable", "19-IX-660", "unit", 8907219.47, 1, 1, 0, "RMSC-MSAS"],
    [523, "233", "Medical Equipment", "C-Arm System Portable ", "19-IX-661", "unit", 8907219.47, 1, 1, 0, "Philsports-MSAS Operating Room"],
    [524, "233", "Medical Equipment", "Hydrocollator Dimension:L810mm x W500mm x H710mm", "15-IX-642", "unit", 61600.0, 1, 1, 0, "Philsports-MSAS P.T. Room"],
    [525, "233", "Medical Equipment", "BAP Board", "04-IX-506", "unit", 70000.0, 1, 1, 0, "Philsports-MSAS P.T. Room"],
    [526, "233", "Medical Equipment", "Customized Cabinet System half acrylic & table w/ LED strip type, Wall Mount Oxygen with half                 cabinet 2 pcs, & regulator mounted w/ co", "2019-VII-1-063, A", "lot", 381960.0, 1, 1, 0, "RMSC - Transportation Unit (Ambulance)"],
    [527, "233", "Medical Equipment", "Theragun Pro - 300min. SN: 211903547", "2023-IX-671", "unit", 50000.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [528, "233", "Medical Equipment", "Theragun Pro - 300min. SN: 211903489", "2023-IX-672", "unit", 50000.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [529, "233", "Medical Equipment", "Theragun Pro - 300min. SN: 211903549", "2023-IX-673", "unit", 50000.0, 1, 1, 0, "PSC Baguio-MSAS Building"],
    [530, "233", "Medical Equipment", "Theragun Pro - 300min. SN: 211903484", "2023-IX-674", "unit", 50000.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [531, "233", "Defribillator", "Automated External Defibrillator (AED), with CPR Advisor and Metronome, sn: 19B90018843", "2021-IX-670", "unit", 245000.0, 1, 1, 0, "RMSC-Admin Bldg. Lobby Ground Floor"],
    [532, "233", "Defribillator", "Automated External Defibrillator (AED), with CPR Advisor and Metronome, sn: 19B90018849", "2021-IX-669", "unit", 245000.0, 1, 1, 0, "RMSC-MSAS Building Lobby"],
    [533, "233", "Defribillator", "Automated External Defibrillator (AED), with CPR Advisor and Metronome, sn: 19B90018847", "2021-IX-668", "unit", 245000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th floor"],
    [534, "233", "Defribillator", "Automated External Defibrillator (AED), with CPR Advisor and Metronome, sn: 19B90018846", "2021-IX-667", "unit", 245000.0, 1, 1, 0, "Philsports-MSAS Building Ground Floor"],
    [535, "233", "Medical Equipment", "Recovery System with Patented Dynamic Compression Massage Technology SN: 15R114516", "2023-IX-0677", "unit", 70000.0, 1, 1, 0, "PSC Baguio-MSAS Building"],
    [536, "233", "Medical Equipment", "Recovery System with Patented Dynamic Compression Massage Technology SN: 15R116273", "2023-IX-0675", "unit", 70000.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [537, "233", "Medical Equipment", "Recovery System with Patented Dynamic Compression Massage Technology SN: 15R114261", "2023-IX-0676", "unit", 70000.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [538, "233", "Medical Equipment", "Inverter Heater, SN: 828110023250341003", "2025-IX-678", "unit", 147000.0, 1, 1, 0, "RMSC-Swimming pool venue"],
    [539, "233", "Medical Equipment", "Inverter Heater, SN: 828110023250341002", "2025-IX-679", "unit", 147000.0, 1, 1, 0, "Philsports-Swimming pool venue"],
    [540, "235", "Basketball Goal", "Hydraulic, Fiberglass board", "99-XII-4-310", "unit", 590879.25, 1, 1, 0, "Maybunga Warehouse"],
    [541, "235", "Basketball Goal", "Hydraulic, Fiberglass board", "99-XII-4-311", "unit", 590879.25, 1, 1, 0, "Maybunga Warehouse"],
    [542, "235", "Basketball Goal", "Schelde Hydraulic, Fiberglass Board", "99-XII-4-312", "unit", 590879.25, 1, 1, 0, "Maybunga Warehouse"],
    [543, "235", "Basketball Goal", "Schelde Hydraulic, Fiberglass Board", "99-XII-4-313", "unit", 590879.25, 1, 1, 0, "Maybunga Warehouse"],
    [544, "235", "Basketball Goal", "Portable Basketball Goals System Electric operation-FIBA Approved", "2019-XII-4-384", "pair", 2150000.0, 1, 1, 0, "Philsports-MPA"],
    [545, "235", "Basketball Goal", "Portable Basketball Goals System Electric operation-FIBA Approved", "2019-XII-4-385", "pair", 2150000.0, 1, 1, 0, "Philsports-MPA"],
    [546, "235", "Bowling Equipment", "Bowling Equipment w/ complete accessories", "98-XII-4-241 up to 332", "set", 10043403.1, 1, 1, 0, "RMSC-PSC Bowling Center "],
    [547, "235", "Cable Crossover Machine", "Class A Cable Crossover Machine w/ 2 x 200lbs", "13-XI-3-725", "unit", 111720.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [548, "235", "Gym Equipment", "Hammer Leg Press (1 unit) / Hammer Pull Down (1 unit) / Power Sledge (1 unit) / PLYO Box (1 unit) / 4 Station Ridles (1 unit)", "2024-XI-3-1056", "Set", 209000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [549, "235", "Gym Equipment", "Rowing Ergometer SN:430984051", "20-XI-3-972", "unit", 191530.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [550, "235", "Gym Equipment", "Rowing Ergometer SN:430971992", "20-XI-3-973", "unit", 191530.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [551, "235", "Gym Equipment", "Rowing Ergometer SN:430984054", "20-XI-3-974", "unit", 191530.0, 1, 1, 0, "Philsports-MSAS Building Sports PT Room"],
    [552, "235", "Gym Equipment", "Rowing Ergometer SN:430984146", "20-XI-3-975", "unit", 191530.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [553, "235", "Gym Equipment", "Rowing Ergometer SN:430971985", "20-XI-3-976", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [554, "235", "Gym Equipment", "Rowing Ergometer SN:430986568", "20-XI-3-977", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [555, "235", "Gym Equipment", "Rowing Ergometer SN:430992677", "20-XI-3-978", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [556, "235", "Gym Equipment", "Rowing Ergometer SN:430971923", "20-XI-3-979", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [557, "235", "Gym Equipment", "Rowing Ergometer SN:430984044", "20-XI-3-980", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [558, "235", "Gym Equipment", "Rowing Ergometer SN:430987923", "20-XI-3-981", "unit", 191530.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [559, "235", "Gym Equipment", "Rowing Ergometer SN:430984052", "20-XI-3-982", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [560, "235", "Gym Equipment", "Rowing Ergometer SN:430971978", "20-XI-3-983", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [561, "235", "Gym Equipment", "Rowing Ergometer SN:430984134", "20-XI-3-984", "unit", 191530.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [562, "235", "Gym Equipment", "Clamp Dynamometer SN: GSH00030", "20-XI-3-939", "unit", 156703.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [563, "235", "Gym Equipment", "Clamp Dynamometer SN: GSH00021", "20-XI-3-940", "unit", 156703.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [564, "235", "Gym Equipment", "Clamp Dynamometer SN: GSH00031", "20-XI-3-941", "unit", 156703.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [565, "235", "Gym Equipment", "Clamp Dynamometer SN: GSH00080", "20-XI-3-942", "unit", 156703.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [566, "235", "Gym Equipment", "Skill Mill", "2022-XI-3-1015", "unit", 62000.0, 1, 1, 0, "Maybunga Warehouse"],
    [567, "235", "Gym Equipment", "Skill Mill", "2022-XI-3-1016", "unit", 62000.0, 1, 1, 0, "Maybunga Warehouse"],
    [568, "235", "Gym Equipment", "Cycling Ergometer SN: WM8D8923", "20-XI-3-931", "unit", 488400.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [569, "235", "Gym Equipment", "Cycling Ergometer SN: WM8D8972", "20-XI-3-932", "unit", 488400.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [570, "235", "Gym Equipment", "Cycling Ergometer SN: WM8D9060", "20-XI-3-933", "unit", 488400.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [571, "235", "Gym Equipment", "Cycling Ergometer SN: WM8D8920", "20-XI-3-934", "unit", 488400.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [572, "235", "Gym Equipment", "Accelerometer", "20-XI-3-960", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [573, "235", "Gym Equipment", "Accelerometer", "20-XI-3-961", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [574, "235", "Gym Equipment", "Accelerometer", "20-XI-3-962", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [575, "235", "Gym Equipment", "Accelerometer", "20-XI-3-963", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [576, "235", "Gym Equipment", "Accelerometer", "20-XI-3-964", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [577, "235", "Gym Equipment", "Accelerometer", "20-XI-3-965", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [578, "235", "Gym Equipment", "Accelerometer", "20-XI-3-966", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [579, "235", "Gym Equipment", "Accelerometer", "20-XI-3-967", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [580, "235", "Gym Equipment", "Accelerometer", "20-XI-3-968", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [581, "235", "Gym Equipment", "Accelerometer", "20-XI-3-969", "unit", 69930.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [582, "235", "Gym Equipment", "Portable Force Plate for Jump Test Force Plateform (60x80cm-weight 18kg.) SN:K14821200304-1 w/ Carrying Bag and / A.NOTEBOOK PC", "20-XI-3-970, 970A", "set", 2600000.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [583, "235", "Gym Equipment", "Portable Force Plate for Jump Test Force Plateform (60x80cm-weight 18kg.) SN:K14821200304-2 w/ Carrying Bag and / A.NOTEBOOK PC", "20-XI-3-971, 971A", "set", 2600000.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [584, "235", "Gym Equipment", "Echo Training System (Nanuk Accessories Travel Case w/ Accessories for Echo Training System Zephyr) A.HP Laptop w/ preconfigure Omnisense", "20-XI-3-958, 958A", "set", 6197793.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [585, "235", "Gym Equipment", "Echo Training System (Nanuk Accessories Travel Case w/ Accessories for Echo Training System Zephyr) A.HP Laptop w/ preconfigure Omnisense", "20-XI-3-959, 959A", "set", 6197793.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [586, "235", "Gym Equipment", "Exercise Swimming Pool (Endless Pool)", "20-XI-3-1013", "lot", 6350400.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [587, "235", "Gym Equipment", "Exercise Swimming Pool (Endless Pool)", "20-XI-3-1014", "lot", 6350400.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [588, "235", "Gym Equipment", "Cardio Pulmunary Exercise Test System (Portable Breath by Breath Analyzer) Cortex MetaMax3B Mobile Ergospirometry System A.1xMetaMax3B Portable CPET S", "20-XI-3-1011 / A,B,C,D", "lot", 9789300.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [589, "235", "Gym Equipment", "Treadmill w/ Accessories", "20-XI-3-985", "unit", 11004947.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [590, "235", "Gym Equipment", "Cardio Pulmunary Exercise Test System (Stationary Breath by Breath Analyzer)", "20-XI-3-1012", "lot", 13289900.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [591, "235", "Gym Equipment", "Sports Laboratory w/ Accessories Sports Laboratory w/ Accessories  A. DATA STATION (Amount PHP 13,800,000.00)  CPU 2 processors Intel Xeon Series 5600", "20-XI-3-921 A,B,C,D,E,F,", "lot", 34800000.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [592, "235", "Gym Equipment", "Precor 407B, Cable Crossover Pulley", "13-XI-3-748", "unit", 245000.0, 1, 1, 0, "Philsports-MPA"],
    [593, "235", "Lat Pulldown Machine", "Class A Lat Pulldown Machine w/ 250lbs", "13-XI-3-733", "unit", 76440.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [594, "235", "Olympic Leg Press Plate Load Machine", "Class A Olympic Leg Press Plate Load Machine", "13-XI-3-732", "unit", 58800.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [595, "235", "Olympic Power Trust", "Class A Olympic Power Trust", "13-XI-3-734", "unit", 68800.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [596, "235", "Seated Cable Row Machine", "Class A Seated Cable Row Machine w/ 250lbs", "13-XI-3-730", "unit", 76440.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [597, "235", "Soccer Goal", "Set of Soccer Goal", "14-XI-3-813", "sets", 308292.8, 1, 1, 0, "RMSC-Track Oval Stadium"],
    [598, "235", "Speed Clave", "Speed Clave", "99-IX-438", "unit", 132716.0, 1, 1, 0, "RMSC-MSAS Clinic Medical"],
    [599, "235", "Sports Equipment", "9 rolls Taraflex Teal, Size:7mm x 1.5m x 18m / 12 rolls Taraflex Teal, Size:7mm x 1.5m x 21m / 2 rolls Taraflex Teal, Size:7mm x 1.5m x 22m / 6rolls T", "No Property #", "set", 2990101.87, 1, 1, 0, "Philsports-MPA Stadium"],
    [600, "235", "Sports Equipment", "Champ Start w/ wired Microphone 230V", "19-XI-3-876", "unit", 298550.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [601, "235", "Sports Equipment", "System 6 Timer, Computer Consule", "19-XI-3-875", "unit", 991800.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [602, "235", "Sports Equipment", "Stogare reels (100m capacity / reel)", "19-XI-3-917", "unit", 302500.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [603, "235", "Sports Equipment", "Stogare reels (100m capacity / reel)", "19-XI-3-918", "unit", 302500.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [604, "235", "Sports Equipment", "Stogare reels (100m capacity / reel)", "19-XI-3-919", "unit", 302500.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [605, "235", "Sports Equipment", "Stogare reels (100m capacity / reel)", "19-XI-3-920", "unit", 302500.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [606, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-902", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [607, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-903", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [608, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-904", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [609, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-905", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [610, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-906", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [611, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-907", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [612, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-908", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [613, "235", "Sports Equipment", "ANTI Super Starting Block 600", "19-XI-3-909", "unit", 177125.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [614, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-886", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [615, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-887", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [616, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-888", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [617, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-889", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [618, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-890", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [619, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-891", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [620, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-892", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [621, "235", "Sports Equipment", "Relay Judging Platform", "19-XI-3-893", "unit", 247900.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [622, "235", "Sports Equipment", "Anti Maxi (150mm Diameter) Racing Lanes 50m", "19-XI-3-910", "unit", 302500.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [623, "235", "Sports Equipment", "Anti Maxi (150mm Diameter) Racing Lanes 50m", "19-XI-3-911", "unit", 302500.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [624, "235", "Sports Equipment", "Anti Maxi (150mm Diameter) Racing Lanes 50m", "19-XI-3-912", "unit", 302500.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [625, "235", "Sports Equipment", "Anti Maxi (150mm Diameter) Racing Lanes 50m", "19-XI-3-913", "unit", 302500.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [626, "235", "Sports Equipment", "Anti Maxi (150mm Diameter) Racing Lanes 50m", "19-XI-3-914", "unit", 302500.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [627, "235", "Sports Equipment", "Anti Maxi (150mm Diameter) Racing Lanes 50m", "19-XI-3-915", "unit", 302500.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [628, "235", "Sports Equipment", "Anti Maxi (150mm Diameter) Racing Lanes 50m", "19-XI-3-916", "unit", 302500.0, 1, 1, 0, "Philsports-Swimming Pool"],
    [629, "235", "Sports Equipment", "8-Digital Numeric Electronic Scoreboard: 8 lane", "19-XI-3-885", "unit", 2263000.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [630, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-894", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [631, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-895", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [632, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-896", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [633, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-897", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [634, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-898", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [635, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-899", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [636, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-900", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [637, "235", "Sports Equipment", "ANTI Super Starting Block 800", "19-XI-3-901", "unit", 336000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [638, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-877", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [639, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-878", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [640, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-879", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [641, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-880", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [642, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-881", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [643, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-882", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [644, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-883", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [645, "235", "Sports Equipment", "Touch Pad - GH,240 cm x 90cm final Aquagrip", "19-XI-3-884", "unit", 361915.62, 1, 1, 0, "RMSC-Swimming Pool"],
    [646, "235", "Sports Equipment", "High jump upright", "2025-XI-3-1106 to 2025-XI-3-1108", "set", 195000.0, 3, 3, 0, "Maybunga Warehouse"],
    [647, "235", "Sports Equipment", "Weighing Scale for Sambo", "2025-XI-3-1109 to 2025-XI-3-1112", "unit", 720000.0, 4, 4, 0, "Maybunga Warehouse"],
    [648, "235", "Sports Equipment", "Pole vault upright", "2025-XI-3-1113", "set", 805000.0, 1, 1, 0, "Maybunga Warehouse"],
    [649, "235", "Sports Equipment", "Sambo Mats Cover", "2025-XI-3-1114 to 2025-XI-3-1116", "lot", 930000.0, 3, 3, 0, "Maybunga Warehouse"],
    [650, "235", "Sports Equipment", "Sambo Mats", "2025-XI-3-1117", "lot", 1100000.0, 1, 1, 0, "Maybunga Warehouse"],
    [651, "235", "Sports Equipment", "Boxing Ring ", "2025-XI-3-1118 to 2025-XI-3-1119", "set", 1400000.0, 2, 2, 0, "Maybunga Warehouse"],
    [652, "235", "Sports Equipment", "Sambo Competition Mats", "2025-XI-3-1120 to 2025-XI-3-1121", "lot", 2200000.0, 2, 2, 0, "Maybunga Warehouse"],
    [653, "235", "Sports Equipment", "High jump landing pit", "2025-XI-3-1122", "set", 1341000.0, 1, 1, 0, "Maybunga Warehouse"],
    [654, "235", "Sports Equipment", "Pole vault landing pit", "2025-XI-3-1123 to 2025-XI-3-1124", "set", 7042000.0, 2, 2, 0, "Maybunga Warehouse"],
    [655, "235", "Sports Equipment", "Platform for Wrestling", "2025-XI-3-1125 to 2025-XI-3-1126", "set", 27000000.0, 2, 2, 0, "Maybunga Warehouse"],
    [656, "235", "Taraflex", "Taraflex, Model: 6512 (Green)", "99-XI-3-177", "roll", 80730.0, 1, 1, 0, "Philsports-MPA (Stock Room)"],
    [657, "235", "Taraflex", "Taraflex, Model: 6512 (Green)", "99-XI-3-178", "roll", 80730.0, 1, 1, 0, "Philsports-MPA (Stock Room)"],
    [658, "235", "Taraflex", "Taraflex, Model: 6512 (Green)", "99-XI-3-179", "roll", 80730.0, 1, 1, 0, "Philsports-MPA (Stock Room)"],
    [659, "235", "Time System Aquatic Timing", "Time System set the standard in Aquatic Timing and scoring with system", "19-XI-3-874", "unit", 700000.0, 1, 1, 0, "RMSC-Swimming Pool"],
    [660, "235", "Boxing ring", "Boxing ring with complete accessories", "2025-XI-3-1095", "unit", 495000.0, 1, 1, 0, "Maybunga Warehouse"],
    [661, "235", "Boxing ring", "Boxing ring with complete accessories", "2025-XI-3-1102", "unit", 590000.0, 1, 1, 0, "Maybunga Warehouse"],
    [662, "235", "Boxing ring", "Boxing ring with complete accessories", "2025-XI-3-1103", "unit", 590000.0, 1, 1, 0, "Maybunga Warehouse"],
    [663, "235", "Boxing ring", "Boxing ring with complete accessories", "2025-XI-3-1104", "unit", 590000.0, 1, 1, 0, "Maybunga Warehouse"],
    [664, "235", "Speed Boat", "Aluminum, 420 Dory wide body Quintrex", "No Property #", "unit", 146000.0, 1, 1, 0, "Rowing-La Mesa Dam Note: For board approval to donate"],
    [665, "235", "Umpire Boat", "Umpire Boat ", "No Property #", "unit", 260838.58, 1, 1, 0, "Rowing-La Mesa Dam Note: For board approval to donate"],
    [666, "235", "Sports Equipment", "1 unit cable cross over pulley machine ", "No Property #", "unit", 54000.0, 1, 1, 0, "PSC-Baguio (Defective/For Disposal)"],
    [667, "235", "Taraflex", "Volleyball Flooring FWB Approved (Gerfloor Flooring)", "2024-XI-3-1017 to 2024-XI-3-1054", "roll", 6800000.0, 38, 38, 0, "Rizal Memorial Coliseum"],
    [668, "235", "Goal", "Futsal Goal", "2024-XI-3-1058", "unit", 55000.0, 1, 1, 0, "Maybunga Warehouse"],
    [669, "235", "Goal", "Futsal Goal", "2024-XI-3-1059", "unit", 55000.0, 1, 1, 0, "Maybunga Warehouse"],
    [670, "235", "Scoreboard", "Basketball Portable Scoreboard with Control System", "2025-XI-3-1060", "unit", 60000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [671, "235", "Scoreboard", "Basketball Portable Scoreboard with Control System", "2025-XI-3-1061", "unit", 60000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [672, "235", "Scoreboard", "Basketball Portable Scoreboard with Control System", "2025-XI-3-1062", "unit", 62000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [673, "235", "Scoreboard", "Basketball Portable Scoreboard with Control System", "2025-XI-3-1063", "unit", 62000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [674, "235", "Scoreboard", "Basketball Portable Scoreboard with Control System", "2025-XI-3-1064", "unit", 62000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [675, "235", "Scoreboard", "Basketball Portable Scoreboard with Control System", "2025-XI-3-1065", "unit", 62000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [676, "235", "Flooring", "Portable Hardwood Flooring", "2025-XI-3-1066", "set", 13501901.7, 1, 1, 0, "Philsports-MPA Stadium"],
    [677, "235", "Sports Equipment", "Billiard Table with accessories, Brunswick, size: 5x9ft, slate: Granite, Cushion: Master Banda, Corner and side pocket cover: Metal, Pocket: Autoball", "2025-XI-3-1094", "set", 106400.0, 1, 1, 0, "Maybunga Warehouse"],
    [678, "235", "Gym Equipment", "Impulse Full Power Rack Model: SL7015", "2025-IX-3-1068", "unit", 100000.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [679, "235", "Gym Equipment", "Impulse Full Power Rack Model: SL7014", "2025-IX-3-1069", "unit", 76000.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [680, "235", "Gym Equipment", "Impulse IFFT Functional Trainer , 200lbs x2 w/ Accessories", "2025-IX-3-1070", "unit", 126400.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [681, "235", "Gym Equipment", "Hex rubber Dumbbell set 5 -50Lbs with Rack", "2025-IX-3-1071", "unit", 61200.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [682, "235", "Gym Equipment", "Hex rubber Dumbbell set 5 -50Lbs with Rack", "2025-IX-3-1072", "unit", 61200.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [683, "235", "Gym Equipment", "Competition kettlebell with stainless handles 8, 10, 12, 16, 20, 24, 28, 32kg with Rack", "2025-IX-3-1073", "unit", 55800.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [684, "235", "Gym Equipment", "Competition kettlebell with stainless handles 8, 10, 12, 16, 20, 24, 28, 32kg with Rack", "2025-IX-3-1074", "unit", 55800.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [685, "235", "Gym Equipment", "Advantek Curve Treadmill", "2025-IX-3-1075", "unit", 280000.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [686, "235", "Gym Equipment", "Advantek Curve Treadmill", "2025-IX-3-1076", "unit", 280000.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [687, "235", "Gym Equipment", "Impulse Airbike", "2025-IX-3-1077", "unit", 73600.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [688, "235", "Gym Equipment", "Impulse Airbike", "2025-IX-3-1078", "unit", 73600.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [689, "235", "Gym Equipment", "Fix barbell set straight / EZ curl w/ rack 20, 30, 40, 50, 60lbs each", "2025-IX-3-1079", "unit", 163000.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [690, "235", "Gym Equipment", "Impulse leg extension / leg curl machine, 250Lbs weight stack, Black upholstery", "2025-IX-3-1080", "unit", 116000.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [691, "235", "Gym Equipment", "Impulse leg extension / leg curl machine, 250Lbs weight stack, Black upholstery", "2025-IX-3-1081", "unit", 105000.0, 1, 1, 0, "PSC Baguio-Track Oval Gym"],
    [692, "235", "Sports Equipment", "Boxing Ring", "-", "unit", 0.0, 1, 1, 0, "PSC Baguio-Multipurpose Gym (Found in Station)"],
    [693, "235", "Sports Equipment", "Billiard Table with Accessories", "-", "unit", 0.0, 1, 1, 0, "PSC Baguio-Multipurpose Storage Room Alley (Found in Station)"],
    [694, "241", "Motor Vehicle", "2009 Isuzu Crosswind Sportivo MT Plate# SJP-397", "09-VII-1-044", "unit", 1149000.0, 1, 1, 0, "RMSC-Transportation Unit (c/o DED-AFMS Office)"],
    [695, "241", "Motor Vehicle", "Toyota Fortuner 4x2, Model:GUN165LSDTMHM004 Color: AVANT GARDE BRONZE METALLIC Plate #: NAZ-6658", "17-VII-1-058", "unit", 1854000.0, 1, 1, 0, "RMSC-Transportation Unit (c/o Chairman's Office)"],
    [696, "241", "Motor Vehicle", "Motor Cycle Scooter - Yamaha MIO Model:MIO I 125-2019 ", "19-VII-1-064", "unit", 85650.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [697, "241", "Motor Vehicle", "Motor Cycle Scooter - Honda Beat Model:AGH110CBTK ", "19-VII-1-065", "unit", 85650.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [698, "241", "Motor Vehicle", "Isuzu NHR55E Dropside Body Cargo Truck Color: Arc White Plate # SJS-634 SN: PABNHR55EL8203344", "09-VII-1-050", "unit", 936000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [699, "241", "Motor Vehicle", "Isuzu NHRPV w/ Single Aircon Color: Arc White Plate # SJS-635 Engine No.: # 4JB1-806447P SN: PABNHR55EL9203365", "09-VII-1-049", "unit", 952000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [700, "241", "Motor Vehicle", "2009 Isuzu Crosswind Sportivo MT Plate# SJP-398", "09-VII-1-043", "unit", 1149000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [701, "241", "Motor Vehicle", "2009 Isuzu Crosswind Sportivo MT Plate# SJP-396", "09-VII-1-045", "unit", 1149000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [702, "241", "Motor Vehicle", "2009 Isuzu Crosswind Sportivo MT Plate# SJS-627", "09-VII-1-046", "unit", 1149000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [703, "241", "Motor Vehicle", "2009 Isuzu Crosswind Sportivo MT 2009, Color: Infitine Gold, Plate No. SJS-611", "09-VII-1-048", "unit", 1149000.0, 1, 1, 0, "RMSC-Transportation Unit (c/o COA Office)"],
    [704, "241", "Motor Vehicle", "Hyundai Grand Starex GL TCI 10 Seater MT-V Plate#SJX-994 ", "09-VII-1-051", "unit", 1203000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [705, "241", "Motor Vehicle", "Toyota Innova 2.5V DSL A/T Color: 1G3 Gray Metallic Plate No. 7194", "16-VII-1-054", "unit", 1306500.0, 1, 1, 0, "RMSC-Transportation Unit (c/o BCSSS Office)"],
    [706, "241", "Motor Vehicle", "Toyota Innova 2.5V DSL A/T Color: 211 Black, Plate No. NDV-7190", "16-VII-1-055", "unit", 1306500.0, 1, 1, 0, "RMSC-Transportation Unit (c/o Commissioner Walter Torres' Office)"],
    [707, "241", "Motor Vehicle", "Toyota Innova 2.5V DSL A/T Color: 12G3 Gray Metallic Plate No. NDV-7192", "16-VII-1-056", "unit", 1306500.0, 1, 1, 0, "RMSC- Transportation Unit (c/o Commissioner Gaston's Office)"],
    [708, "241", "Motor Vehicle", "Hyundai Grand Starex TCI Ambulance Year: 2017 Color:Creamy White Plate No.: MS-6863", "19-VII-1-063", "unit", 1495000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [709, "241", "Motor Vehicle", "Toyota, Hi-Ace Commuter De-Luxe, 2.8 DSL, White, Model 2021, Plate No. S2-D619", "21-VII-1-069", "unit", 1649000.0, 1, 1, 0, "RMSC- Transportation Unit (c/o Comm Hayco's Office)"],
    [710, "241", "Motor Vehicle", "Toyota, Hi-Ace Commuter De-Luxe, 2.8 DSL, Silver Metallic, Model 2021, MT, Power Steering, 15 capacity", "21-VII-1-070", "unit", 1649000.0, 1, 1, 0, "RMSC-Transportation Unit (c/o Comm Coo's Office)"],
    [711, "241", "Motor Vehicle", "Hyundai Starex Ambulance TCI Color:Creamy White Year:2016 Temp. Plate No. 040109", "19-VII-1-066", "unit", 2048568.0, 1, 1, 0, " PSC Baguio-Transportation Unit (c/o MSAS) "],
    [712, "241", "Motor Vehicle", "Hyundai Starex Ambulance TCI  Color:Creamy White Year:2017, Plate No.: MS-6474", "19-VII-1-067", "unit", 2048568.0, 1, 1, 0, "Philsports-Transportation Unit (c/o MSAS)"],
    [713, "241", "Motor Vehicle", "Toyota Coaster 30 Seater Color: 058 White, Plate No.: NDV-7189", "16-VII-1-057", "unit", 3326500.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [714, "241", "Motor Vehicle", "Mini Bus Isuzu NQR Color: Arc White Plate # SJS-647 SN: PABN1R7RL9200525", "09-VII-1-052", "unit", 3400000.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [715, "241", "Motor Vehicle", "Toyota Innova 2.5V DSL A/T Color: 1D4 Themalyte Plate No.: NDV-7191", "16-VII-1-053", "unit", 1306500.0, 1, 1, 0, "RMSC-Transportation Unit (c/o COA Office)"],
    [716, "241", "Motor Vehicle", "Isuzu Truck Bus Plate no. CRJ-186", "No Property Number", "unit", 0.0, 1, 1, 0, "RMSC-Pumping Station (currently STARBUS)"],
    [717, "241", "Motor Vehicle", "Coaster, Golden Dragon, Mini Bus, Model No.: XML6700, White", "25-VII-1-071", "unit", 3952195.71, 1, 1, 0, "RMSC-Transportation Unit"],
    [718, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190174", "19-II-1-924", "unit", 97424.6, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 303 (DED-BCSSS Office)"],
    [719, "250", "Airconditioner", "Carrier, floor mounted, split type, sn:0916118", "AC-II-1-024", "unit", 70000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 101 (NSA Office)"],
    [720, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190208", "19-II-1-909", "unit", 97424.6, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor Room 103 (Record's Office)"],
    [721, "250", "Airconditioner", "Solar Air Hybrid 2.5hp Wall Mounted", "15-II-1-691", "unit", 78500.0, 1, 1, 0, "RMSC-Admin BLDG 4th Floor Room 401 (Chairman's Office)"],
    [722, "250", "Airconditioner", "Kolin (Package Type) 3TRsn:10270908-13718", "10-II-1-653", "unit", 118590.0, 1, 1, 0, "RMSC-Admin BLDG 4th Floor Room 401 (Chairman's Office)"],
    [723, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180322", "19-II-1-858", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [724, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180325", "19-II-1-860", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [725, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180336", "19-II-1-863", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground floor (NSA Affairs Office)"],
    [726, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190489", "19-II-1-1089", "unit", 56755.95, 1, 1, 0, "Philsports-Building A. Attic 5th Floor"],
    [727, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190496", "19-II-1-1095", "unit", 56755.95, 1, 1, 0, "Philsports-Building A. Attic 5th Floor"],
    [728, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN: IV25BIF190497", "19-II-1-1096", "unit", 56755.95, 1, 1, 0, "Philsports-Building A. Attic 5th Floor"],
    [729, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190520", "19-II-1-1108", "unit", 56755.95, 1, 1, 0, "Philsports-Building A. Attic 5th Floor"],
    [730, "250", "Airconditioner", "Control Aircon", "99-II-1-226", "unit", 111000.0, 1, 1, 0, "Philsports-BLDG A. AVR grd flr, room 101 "],
    [731, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190086", "19-II-1-948", "unit", 97424.6, 1, 1, 0, "Philsports-Building A. Attic 5th Floor"],
    [732, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190087", "19-II-1-949", "unit", 97424.6, 1, 1, 0, "Philsports-Building A. Attic 5th Floor"],
    [733, "250", "Airconditioner", "GGE-V25 Vission 2.5HP, Wall Mounted SN:50048", "18-II-1-838", "set", 77000.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 203 (DED-AFMS Office)"],
    [734, "250", "Airconditioner", "Everest 2.5 HP Inverter Type M:ETIV25BST-HF SN:IV25BIF190504", "19-II-1-892", "unit", 56755.95, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [735, "250", "Airconditioner", "Everest 2.5 HP Inverter Type M:ETIV25BST-HF SN:IV25BIF190479", "19-II-1-893", "unit", 56755.95, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [736, "250", "Airconditioner", "Floor Mounted Ceiling Type Inverter 3TR 4HP M:GGE-VFC036 SN:500129 Indoor / 500129 Outdoor", "18-II-1-846", "unit", 125513.82, 1, 1, 0, "10 meters room, Shooting Range Venue-Fort Bonifacio"],
    [737, "250", "Airconditioner", "Floor Mounted Ceiling Type Inverter 3TR 4HP M:GGE-VFC036 SN:500125 Indoor / 500126 Outdoor", "18-II-1-847", "unit", 125513.82, 1, 1, 0, "10 meters room, Shooting Range Venue-Fort Bonifacio"],
    [738, "250", "Airconditioner", "Floor Mounted Ceiling Type Inverter 3TR 4HP M:GGE-VFC036 SN:500131 Indoor / 500137 Outdoor", "18-II-1-848", "unit", 125513.82, 1, 1, 0, "10 meters room, Shooting Range Venue-Fort Bonifacio / DEFECTIVE ITEM"],
    [739, "250", "Airconditioner", "Floor Mounted Ceiling Type Inverter 3TR 4HP M:GGE-VFC036 SN:500123 Indoor / 500135 Outdoor", "18-II-1-849", "unit", 125513.82, 1, 1, 0, "10 meters room, Shooting Range Venue-Fort Bonifacio"],
    [740, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190181", "19-II-1-907", "unit", 97424.6, 1, 1, 0, "RMSC-Admin Bldg. 4th Flr Hallway"],
    [741, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2IA190100", "19-II-1-921", "unit", 97424.6, 1, 1, 0, "RMSC-Admin Bldg. 4th Flr Hallway"],
    [742, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190158", "19-II-1-922", " ", 97424.6, 1, 1, 0, "Philsports-Property Office Storage"],
    [743, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190173", "19-II-1-923", "unit", 97424.6, 1, 1, 0, "RMSC-Admin Bldg. 3rd Flr Hallway"],
    [744, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190203", "19-II-1-925", "unit", 97424.6, 1, 1, 0, "RMSC-Admin Bldg. Lobby Ground Floor"],
    [745, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190198", "19-II-1-936", "unit", 97424.6, 1, 1, 0, "RMSC-Admin Bldg. Lobby Ground Floor"],
    [746, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180315", "19-II-1-855", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Athlete's Dining Hall)"],
    [747, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180318", "19-II-1-856", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Athlete's Dining Hall)"],
    [748, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180321", "19-II-1-857", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Athlete's Dining Hall)"],
    [749, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180323", "19-II-1-859", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Athlete's Dining Hall)"],
    [750, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180327", "19-II-1-861", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Athlete's Dining Hall)"],
    [751, "250", "Airconditioner", "Everest 3toner Floor Standing Inverter Type SN:IV36IF180329", "19-II-1-862", "unit", 98789.6, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Athlete's Dining Hall)"],
    [752, "250", "Airconditioner", "Kolin (Package Type) 3TR sn:10270908-13715", "10-II-1-652", "unit", 118590.0, 1, 1, 0, "RMSC-Tennis Sport Cavanna"],
    [753, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190001", "19-II-1-866", "unit", 149749.6, 1, 1, 0, "Gymnastic Gym, Intramuros"],
    [754, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190002", "19-II-1-867", "unit", 149749.6, 1, 1, 0, "RMSC-Weight Lifting Venue"],
    [755, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190006", "19-II-1-868", "unit", 149749.6, 1, 1, 0, "RMSC-Operation / Arnis Gym"],
    [756, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190005", "19-II-1-869", "unit", 149749.6, 1, 1, 0, "RMSC-Operation / Arnis Gym"],
    [757, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190011", "19-II-1-870", "unit", 149749.6, 1, 1, 0, "RMSC-Operation / Arnis Gym"],
    [758, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190012", "19-II-1-871", "unit", 149749.6, 1, 1, 0, "RMSC-Weight Lifting Venue"],
    [759, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190014", "19-II-1-872", "unit", 149749.6, 1, 1, 0, "Gymnastic Gym, Intramuros"],
    [760, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190016", "19-II-1-873", "unit", 149749.6, 1, 1, 0, "Gymnastic Gym, Intramuros"],
    [761, "250", "Airconditioner", "Everest 5toner Floor Standing Inverter Type SN:IV603SDUEA190019", "19-II-1-874", "unit", 149749.6, 1, 1, 0, "RMSC-Weight Lifting Venue"],
    [762, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST-HF SN:IV25BIF190466", "19-II-1-1128", "unit", 56755.95, 1, 1, 0, "RMSC- MSAS Building (Room 111)"],
    [763, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190157", "19-II-1-1195", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building Gym"],
    [764, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190159", "19-II-1-1196", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [765, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190161", "19-II-1-1197", "unit", 97424.6, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [766, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190163", "19-II-1-1198", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [767, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190164", "19-II-1-1199", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [768, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190165", "19-II-1-1200", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [769, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190183", "19-II-1-1201", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [770, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190185", "19-II-1-1202", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building Gym"],
    [771, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190199", "19-II-1-1203", "unit", 97424.6, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [772, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190200", "19-II-1-1204", "unit", 97424.6, 1, 1, 0, "RMSC-Track Oval Stadium VIP Room"],
    [773, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190201", "19-II-1-1205", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [774, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190202", "19-II-1-1206", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [775, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190204", "19-II-1-1207", "unit", 97424.6, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [776, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190215", "19-II-1-1208", "unit", 97424.6, 1, 1, 0, "RMSC-Track Oval Stadium Dag Out 4"],
    [777, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190216", "19-II-1-1209", "unit", 97424.6, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [778, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190217", "19-II-1-1210", "unit", 97424.6, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [779, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190219", "19-II-1-1211", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building Gym"],
    [780, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190220", "19-II-1-1212", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building Gym"],
    [781, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190221", "19-II-1-1213", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [782, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190224", "19-II-1-1214", "unit", 97424.6, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [783, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190225", "19-II-1-1215", "unit", 97424.6, 1, 1, 0, "RMSC-Track Oval Stadium VIP Room"],
    [784, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190226", "19-II-1-1216", "unit", 97424.6, 1, 1, 0, "RMSC-Track Oval Stadium VIP Room"],
    [785, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190230", "19-II-1-1217", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [786, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190250", "19-II-1-1218", "unit", 97424.6, 1, 1, 0, "RMSC-MSAS Building (Billiard Hall)"],
    [787, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2ID190252", "19-II-1-1219", "unit", 97424.6, 1, 1, 0, "RMSC-Track Oval Stadium Dag Out 1"],
    [788, "250", "Airconditioner", "Floor Mounted, Inverter Split Type Aircon SN:60007 indoor / 60006 Outdoor", "17-II-1-789", "unit", 128599.78, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [789, "250", "Airconditioner", "Wall Mounted Split Type Inverter Air Conditioner 2.5HP, Vission Model:GGE-V25 , Indoor SN: 50023, Outdoor SN: 50040", "18-II-1-816", "unit", 68500.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [790, "250", "Airconditioner", "Wall Mounted Split Type Inverter Air Conditioner 2.5HP, Vission Model:GGE-V25 , Indoor SN: 50021, Outdoor SN: 50023", "2018-II-1-817", "unit", 68500.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 408 (COA Office)"],
    [791, "250", "Airconditioner", "Wall Mounted / Splite type Smart Inverter SN:50042 indoor / 50016 outdoor", "18-II-1-808", "unit", 66750.0, 1, 1, 0, "RMSC-Admin BLDG 4th Floor Room 401 (Chairman's Office)"],
    [792, "250", "Airconditioner", "Wall Mounted / Splite type Smart Inverter SN:50047 indoor / 50011 outdoor", "18-II-1-809", "unit", 66750.0, 1, 1, 0, "RMSC-Admin BLDG 4th Floor Room 401 (Chairman's Office)"],
    [793, "250", "Airconditioner", "Everest 3toner Inverter Floor Standing R410A M:ETIV36FSR2/M SN:IV36FSR2IA190054", "19-II-1-920", "unit", 97424.6, 1, 1, 0, "RMSC-Admin BLDG 4th Floor Room 401 (Chairman's Office)"],
    [794, "250", "Airconditioner", "Split Type Inventer 2.5 Model: GGE-V25 Vision SN:5801 indoor / 50031 Outdoor", "17-II-1-806", "set", 67249.82, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [795, "250", "Airconditioner", "Split Type Inventer 2.5 Model: GGE-V25 Vision SN:5807 indoor / 50036 Outdoor", "17-II-1-807", "set", 67249.82, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [796, "250", "Airconditioner", "GGE V25 Wall Mounted Aircon SN:50018 indoor / 50042 outdoor", "18-II-1-810", "unit", 75300.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 304 (Board Secretary Office)"],
    [797, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST-HF SN:IV25BIF190581", "19-II-1-1127", "unit", 56755.95, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 209 (Cashier's Office)"],
    [798, "250", "Airconditioner", "Aircon (Carrier) package type", "09-II-1-649", "unit", 113632.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 209 (Cashier's Office)"],
    [799, "250", "Airconditioner", "Wall Split Type Inverter Airconditioner GGE V25, Vision SN:50060 Indoor / 50061 Outdoor", "17-II-1-794", "unit", 52474.81, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 403 (Comm. Edward Hayco Office)"],
    [800, "250", "Airconditioner", "Wall Split Type Inverter Airconditioner 2.5HP GGE YS11D-24CR, Vision SN:20023 Indoor / 60011 Outdoor", "17-II-1-793", "unit", 55624.81, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 403 (Comm. Walter Torres Office)"],
    [801, "250", "Airconditioner", "GGE-V15 1.5HP Wall Split Type SN:20032 VISSION", "17-II-1-796", "unit", 54959.78, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 403 (PSI Library)"],
    [802, "250", "Airconditioner", "GGE-V15 1.5HP Wall Split Type SN:20002 VISSION", "17-II-1-799", "unit", 55223.78, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 403 (PSI Library)"],
    [803, "250", "Airconditioner", "GGE-V15 1.5HP Wall Split Type SN:20038 VISSION", "17-II-1-795", "unit", 55558.28, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 403 (PSI Library)"],
    [804, "250", "Airconditioner", "GGE-V15 1.5HP Wall Split Type SN:20041 VISSION", "17-II-1-798", "unit", 58765.28, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 403 (PSI Library)"],
    [805, "250", "Airconditioner", "GGE-V15 1.5HP Wall Split Type SN:20034 VISSION", "17-II-1-797", "unit", 61348.28, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 403 (PSI Library)"],
    [806, "250", "Airconditioner", "GGE-V HP Celling Split Type SN:DK293186 KOPPEL", "17-II-1-801", "unit", 69389.9, 1, 1, 0, "Philsports-PSI Library Room (DEFECTIVE)"],
    [807, "250", "Airconditioner", "GGE-V HP Celling Split Type SN:EK293110 KOPPEL", "17-II-1-800", "unit", 75560.9, 1, 1, 0, "Philsports-PSI Library Room (DEFECTIVE)"],
    [808, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190480", "19-II-1-1080", "unit", 56755.95, 1, 1, 0, "Philsports-MSAS Nurse Station"],
    [809, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190481", "19-II-1-1081", "unit", 56755.95, 1, 1, 0, "Philsports- MPA Chairmans Office"],
    [810, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190482", "19-II-1-1082", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [811, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190483", "19-II-1-1083", "unit", 56755.95, 1, 1, 0, "Philsports-MPA Ground Floor "],
    [812, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190484", "19-II-1-1084", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm H 3rd Floor"],
    [813, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190485", "19-II-1-1085", "unit", 56755.95, 1, 1, 0, "Philsports- MPA "],
    [814, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190486", "19-II-1-1086", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm H 3rd Floor"],
    [815, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190487", "19-II-1-1087", "unit", 56755.95, 1, 1, 0, "Philsport-MSAS Operating Room Grd flr"],
    [816, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190488", "19-II-1-1088", "unit", 56755.95, 1, 1, 0, "Philsports-Dining Hall 2nd Floor"],
    [817, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190490", "19-II-1-1090", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [818, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190491", "19-II-1-1091", "unit", 56755.95, 1, 1, 0, "Philsport-MSAS Operating Room Grd flr"],
    [819, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190492", "19-II-1-1092", "unit", 56755.95, 1, 1, 0, "Philsports-MPA 2nd Floor Room 4"],
    [820, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190493", "19-II-1-1093", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm J Athlete's Lounge"],
    [821, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190494", "19-II-1-1094", "unit", 56755.95, 1, 1, 0, "Philsports-MPA Dug-Out F"],
    [822, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190499", "19-II-1-1097", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [823, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190500", "19-II-1-1098", "unit", 56755.95, 1, 1, 0, "Philsports-MPA 2nd Floor Room 5"],
    [824, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190501", "19-II-1-1099", "unit", 56755.95, 1, 1, 0, "Philsports-MPA 2nd Floor Room  4"],
    [825, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190508", "19-II-1-1100", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm H 3rd Floor"],
    [826, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190512", "19-II-1-1101", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [827, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190514", "19-II-1-1103", "unit", 56755.95, 1, 1, 0, "Philsports-MPA 2nd flr Room 8"],
    [828, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190515", "19-II-1-1104", "unit", 56755.95, 1, 1, 0, "Philsports-MPA 2nd flr Room 9"],
    [829, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190516", "19-II-1-1105", "unit", 56755.95, 1, 1, 0, "Philsports-MSAS Massage Room Ground flr"],
    [830, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190517", "19-II-1-1106", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [831, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190518", "19-II-1-1107", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [832, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190521", "19-II-1-1109", "unit", 56755.95, 1, 1, 0, "Philsports-MPA Stadium Clinic Room"],
    [833, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190523", "19-II-1-1110", "unit", 56755.95, 1, 1, 0, "Philsports-MPA Ground Floor Room 2"],
    [834, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190524", "19-II-1-1111", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm J Athlete's Lounge"],
    [835, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190527", "19-II-1-1112", "unit", 56755.95, 1, 1, 0, "Philsports-MPA Ground Floor Room 2"],
    [836, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190528", "19-II-1-1113", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [837, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190529", "19-II-1-1114", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm H 3rd Floor"],
    [838, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190530", "19-II-1-1115", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm H 3rd Floor"],
    [839, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190532", "19-II-1-1116", "unit", 56755.95, 1, 1, 0, "Philsports-Dorm H 3rd Floor"],
    [840, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190533", "19-II-1-1117", "unit", 56755.95, 1, 1, 0, "Philsports-MPA Ground Floor Room 5"],
    [841, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190534", "19-II-1-1118", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [842, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190538", "19-II-1-1119", "unit", 56755.95, 1, 1, 0, "Philsports-MPA Ground Floor Chairmans Office"],
    [843, "250", "Airconditioner", "Everest 2.5HP Inverter Split Type M:ETIV25BST/HF SN:IV25BIF190541", "19-II-1-1120", "unit", 56755.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [844, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190059", "19-II-1-938", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Old Gym (DEFECTIVE)"],
    [845, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190060", "19-II-1-939", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS 2nd flr"],
    [846, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190062", "19-II-1-940", "unit", 97424.6, 1, 1, 0, "RMSC-Badminton Venue (VIP Room)"],
    [847, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190063", "19-II-1-941", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS Physiology Room 2nd flr"],
    [848, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190064", "19-II-1-942", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Dug-Out D"],
    [849, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190065", "19-II-1-943", "unit", 97424.6, 1, 1, 0, "RMSC-Badminton Venue (VIP Room)"],
    [850, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190066", "19-II-1-944", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS P.T. Room Grd flr."],
    [851, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190067", "19-II-1-945", "unit", 97424.6, 1, 1, 0, "RMSC-Badminton Venue (VIP Room)"],
    [852, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190069", "19-II-1-946", "unit", 97424.6, 1, 1, 0, "RMSC-South Tower Track Oval Venue"],
    [853, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190079", "19-II-1-947", "unit", 97424.6, 1, 1, 0, "Philsports-Multi Purpose Hall"],
    [854, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190088", "19-II-1-950", "unit", 97424.6, 1, 1, 0, "Philsports-Multi Purpose Hall"],
    [855, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190090", "19-II-1-951", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS Massage Room 2nd flr"],
    [856, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190091", "19-II-1-952", "unit", 97424.6, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [857, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190092", "19-II-1-953", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS P.T. Room Grd flr."],
    [858, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190093", "19-II-1-954", "unit", 97424.6, 1, 1, 0, "Philsports-Multi Purpose Hall"],
    [859, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190095", "19-II-1-955", "unit", 97424.6, 1, 1, 0, "Philsports-Multi Purpose Hall"],
    [860, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190096", "19-II-1-956", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS Massage Room 2nd flr"],
    [861, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190098", "19-II-1-957", "unit", 97424.6, 1, 1, 0, "RMSC-Property Office"],
    [862, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190099", "19-II-1-958", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS Physiology Room 2nd flr"],
    [863, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190102", "19-II-1-959", "unit", 97424.6, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [864, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190117", "19-II-1-960", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Ground Floor"],
    [865, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190121", "19-II-1-961", "unit", 97424.6, 1, 1, 0, "Philsports-MSAS Physiology Room 2nd flr"],
    [866, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190124", "19-II-1-963", "unit", 97424.6, 1, 1, 0, "RMSC-Property Office"],
    [867, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190128", "19-II-1-964", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Old Gym"],
    [868, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190130", "19-II-1-965", "unit", 97424.6, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 301 (ED Office)"],
    [869, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190132", "19-II-1-966", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Dug-Out E"],
    [870, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190144", "19-II-1-967", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Dug-Out B"],
    [871, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190145", "19-II-1-968", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Dug-Out C"],
    [872, "250", "Airconditioner", "Everest 3 Toner Inverter Floor Standing M:ETIV36FSR2/M SN:IV36FSR21A190146", "19-II-1-969", "unit", 97424.6, 1, 1, 0, "Philsports-MPA Old Gym"],
    [873, "250", "Airconditioner", "Everest 3 Toner Ceiling Cassette Inverter M:ETIV36CC/M SN:IV36CCIA190014", "19-II-1-1121", "unit", 123375.95, 1, 1, 0, "Philsports- MPA arena Room 1"],
    [874, "250", "Airconditioner", "Everest 3 Toner Ceiling Cassette Inverter M:ETIV36CC/M SN:IV36CCIA190019", "19-II-1-1122", "unit", 123375.95, 1, 1, 0, "Philsports-Property Office Storage"],
    [875, "250", "Airconditioner", "Everest 4 Toner Ceiling Cassette Inverter M:ETIV48ACC/M SN:3408477310197230160001", "19-II-1-1123", "unit", 144175.22, 1, 1, 0, "Philsports-Property Office Storage"],
    [876, "250", "Airconditioner", "Everest 4 Toner Ceiling Cassette Inverter M:ETIV48ACC/M SN:3408477310197230160002", "19-II-1-1124", "unit", 144175.22, 1, 1, 0, "Philsports-Property Office Storage"],
    [877, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80762", "19-II-1-880", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-South Tower 4th flr."],
    [878, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80771", "19-II-1-881", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-North Tower 3rd flr."],
    [879, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80844", "19-II-1-882", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-South Tower 3rd flr."],
    [880, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80848", "19-II-1-883", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-North Tower 5th flr."],
    [881, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80852", "19-II-1-884", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-North Tower 2nd flr."],
    [882, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80858", "19-II-1-885", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-South Tower 2nd flr."],
    [883, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80868", "19-II-1-886", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-South Tower 5th flr."],
    [884, "250", "Airconditioner", "Everest 2.5HP Inverter Wall Mounter/Split Type SN:IV25BII80871", "19-II-1-887", "unit", 51989.6, 1, 1, 0, "RMSC-Athlete's Quarter-North Tower 4th flr."],
    [885, "250", "Airconditioner", "Everest 3 toner Inverter flr Standing SN:IV36II180338", "19-II-1-864", "unit", 98789.6, 1, 1, 0, "RMSC-Athlete's Quarter-North Tower Ground Floor"],
    [886, "250", "Airconditioner", "Wall Mounted Airconditioner Vission GGE-G25 SN:50046 indoor / 50017 outdoor", "19-II-1-851", "unit", 52900.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium Dressing Room"],
    [887, "250", "Airconditioner", "Wall Mounted Airconditioner Vission GGE-G25 SN:50006 indoor / 50036 outdoor", "19-II-1-852", "unit", 52900.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium Dressing Room"],
    [888, "250", "Airconditioner", "Wall Mounted Airconditioner Vission GGE-G25 SN:50022 indoor / 50023 outdoor", "19-II-1-853", "unit", 52900.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium Dressing Room"],
    [889, "250", "Airconditioner", "Inverter Floor Mounted Airconditioning with Installation SN:60009 indoor / 60007 outdoor", "18-II-1-812", "unit", 106881.81, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [890, "250", "Airconditioner", "Floor Mounted GGE-VFM36 SN:60001 indoor / 60008 outdoor", "18-II-1-814", "unit", 106881.81, 1, 1, 0, "RMSC-Tennis Sport Cavanna"],
    [891, "250", "Airconditioner", "Split Type Wall Mounted Daiken", "19-II-1-937", "unit", 131000.0, 1, 1, 0, "RMSC-Athlete's Dining Hall Cafeteria (MSAS-Nutrition Unit)"],
    [892, "250", "Airconditioner", "Wall Mounted Airconditioner Vission GGE-G25 SN:50014 indoor / 50056 outdoor", "19-II-1-850", "unit", 52900.0, 1, 1, 0, "RMSC-Admin BLDG. 2nd Floor Room 201 (Admin Office)"],
    [893, "250", "Airconditioner", "Everest 2.5 HP Inverter Split Type M:ETIV25BST-HF SN:IV25BID190363", "19-II-1-918", "unit", 56755.95, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [894, "250", "Airconditioner", "Everest 2.5 HP Inverter Split Type M:ETIV25BST-HF SN:IV25BID190285", "19-II-1-919", "unit", 56755.95, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 305 (ACD Office)"],
    [895, "250", "Airconditioner", "Aston Wall Mounted Air Conditioning Unit M:AS12F-21CR-NB6 SN:20043", "17-II-1-786", "unit", 64577.76, 1, 1, 0, "RMSC-Track Oval Venue (PSC Library)"],
    [896, "250", "Airconditioner", "Aston Wall Mounted Air Conditioning Unit M:AS12F-21CR-NB6 SN:20049", "17-II-1-787", "unit", 64577.76, 1, 1, 0, "RMSC-Track Oval Venue (PSC Library)"],
    [897, "250", "Airconditioner", "Aston Wall Mounted Air Conditioning Unit M:AS12F-21CR-NB6 SN:20008", "17-II-1-788", "unit", 64577.76, 1, 1, 0, "RMSC-Track Oval Venue (PSC Library)"],
    [898, "250", "Airconditioner", "3TR, Floor Standing, Non-Inverter (Midea) SN:22000C23060820006", "2022-II-1-1221", "unit", 134422.4, 1, 1, 0, "Philsports-Dance Sports"],
    [899, "250", "Airconditioner", "3TR, Floor Standing, Non-Inverter (Midea) SN:22000C230608200016", "2022-II-1-1222", "unit", 134422.4, 1, 1, 0, "Philsports-Dance Sports"],
    [900, "250", "Airconditioner", "3TR, Floor Standing, Non-Inverter (Midea) SN:22000C23060820078", "2022-II-1-1223", "unit", 134422.4, 1, 1, 0, "Philsports-Dance Sports"],
    [901, "250", "Airconditioner", "3TR, Floor Standing, Non-Inverter (Midea) SN:22000C23060820082", "2022-II-1-1224", "unit", 134422.4, 1, 1, 0, "Philsports-Dance Sports"],
    [902, "250", "Airconditioner", "3TR, Floor Standing, Non-Inverter (Midea) SN:22000C23060820132", "2022-II-1-1225", "unit", 134422.4, 1, 1, 0, "Philsports-Dance Sports"],
    [903, "250", "Airconditioner", "3TR, Floor Standing, Non-Inverter (Midea) SN:22000C23060820156", "2022-II-1-1226", "unit", 134422.4, 1, 1, 0, "Philsports-Dance Sports"],
    [904, "250", "AVR", "Receiver 165 wx7 Channel Denon, model AVR3313, sn: 2086607045", "13-VI-1-175", "unit", 68000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Conference Room )"],
    [905, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type.     Sn: 340E44211011A280130032", "2023-II-1-1227", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 2 Female)"],
    [906, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type.      Sn: 340E44211011A280130083", "2023-II-1-1228", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 3 Female)"],
    [907, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type.    Sn: 340E44211011A280130165", "2023-II-1-1229", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 4 Female)"],
    [908, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type.       Sn: 340E44211011A280130111", "2023-II-1-1230", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Upper Left Side Female)"],
    [909, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type.       Sn: 340E44211011A280130130", "2023-II-1-1231", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 1 Female)"],
    [910, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130151", "2022-II-1-1232", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 2 Male)"],
    [911, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130173", "2022-II-1-1233", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 1 Male)"],
    [912, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130102", "2022-II-1-1234", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (VIP Room)"],
    [913, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130175", "2022-II-1-1235", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 3 Male)"],
    [914, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130181", "2022-II-1-1236", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 4 Male)"],
    [915, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130148", "2022-II-1-1237", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 6 Male)"],
    [916, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130096", "2022-II-1-1238", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (VIP Room)"],
    [917, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130021", "2022-II-1-1239", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (VIP Room)"],
    [918, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130077", "2022-II-1-1240", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (Room 5 Male)"],
    [919, "250", "Airconditioner", "Matrix Full DC 1.5HP Inverter / Split type. Sn: 340E44211011A280130120", "2022-II-1-1241", "unit", 79637.0, 1, 1, 0, "RMSC-Badminton Venue (VIP Room)"],
    [920, "250", "Airconditioner", "AUX 3TR Floor Mounted ARC, SN: B5545D226606N00149", "2024-II-1-1244", "unit", 177000.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [921, "250", "Airconditioner", "AUX 3TR Floor Mounted ARC, SN: B5545D226606N00049", "2024-II-1-1246", "unit", 177000.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [922, "250", "Airconditioner", "AUX 3TR Floor Mounted ARC, SN: B5545D226606N00141", "2024-II-1-1245", "unit", 177000.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [923, "250", "Airconditioner", "AUX 3TR Floor Mounted ARC, SN: B5545D226606N00035", "2024-II-1-1247", "unit", 177000.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [924, "250", "Airconditioner", "AUX 3HP Wall mounted full DC Inverter, SN: B8388D253502N00750", "2024-II-1-1250", "unit", 248000.0, 1, 1, 0, "Philsports - MPA Arena Chairman's Box"],
    [925, "250", "Airconditioner", "AUX 3HP Wall mounted full DC Inverter, SN: B8388D253502N00731", "2024-II-1-1251", "unit", 248000.0, 1, 1, 0, "Philsports - MPA Arena Chairman's Box"],
    [926, "250", "Airconditioner", "AUX 2.5HP, Floor Mounted, Indoor SN: B6656E380501N00254, Outdoor SN: E0687B384201W00674", "2024-II-1-1254", "unit", 263221.33, 1, 1, 0, "RMSC-Admin Building 2nd Floor Hallway"],
    [927, "250", "Airconditioner", "AUX 2.5HP, Floor Mounted, Indoor SN: B9659E38050IN00284, Outdoor SN: E0687B384201W00651", "2024-II-1-1253", "unit", 263221.33, 1, 1, 0, "RMSC-Swimming Pool (Venue Manager Office)"],
    [928, "250", "Airconditioner", "AUX 2.5HP, Ceiling Suspended, Indoor SN: C1722B422401N00019", "2024-II-1-1252", "unit", 231132.33, 1, 1, 0, "RMSC-Rizal Memorial Coliseum (Security Office)"],
    [929, "250", "Airconditioner", "AUX 2.5 HP, Inverter Window Type ACU, SN: 540595698044C210150015", "2025-II-1-1255", "unit", 164454.5, 1, 1, 0, "RMSC-Admin Bldg. 3rd Floor Room 307 (Legal Office)"],
    [930, "250", "Airconditioner", "AUX 2.5HP, Wall Mounted ACU, Full DC Inverter, SN: B8540E177501N00627", "2025-II-1-1256", "unit", 221454.5, 1, 1, 0, "RMSC-Admin Bldg. 3rd Floor Room 306 (Travel Office)"],
    [931, "250", "Airconditioner", "AUX 2.5HP, Wall Mounted ACU, Full DC Inverter, SN: B8540E379203N00183", "2025-II-1-1257", "unit", 116785.71, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [932, "250", "Airconditioner", "AUX 2.5HP, Wall Mounted ACU, Full DC Inverter, SN: B8540E177501N00616", "2025-II-1-1258", "unit", 116785.71, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [933, "250", "Airconditioner", "AUX 2.5HP, Wall Mounted ACU, Full DC Inverter, SN: B8540E379203N00210", "2025-II-1-1259", "unit", 116785.71, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [934, "250", "Airconditioner", "AUX 2.5HP, Wall Mounted ACU, Full DC Inverter, SN: B8540E379203N00299", "2025-II-1-1260", "unit", 116785.71, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [935, "250", "Airconditioner", "AUX 2.5Hp Wall Mounted, Full DC Inverter Split type w/ ACU extension piping SN: B8540E379203N00217", "2025-II-1-1261", "unit", 116785.71, 1, 1, 0, "RMSC-Squash Venue"],
    [936, "250", "Airconditioner", "AUX 2.5Hp Wall Mounted, Full DC Inverter Split type w/ ACU extension piping SN: B8540E177501N00628", "2025-II-1-1262", "unit", 116785.71, 1, 1, 0, "RMSC-Athletes Quarter, South Tower, 4th Floor"],
    [937, "250", "Airconditioner", "AUX 2.5Hp Wall Mounted, Full DC Inverter Split type w/ ACU extension piping SN: B8540E379203N00191", "2025-II-1-1263", "unit", 116785.71, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [938, "250", "Airconditioner", "Aircon Ceiling Type 5TR", "-", "unit", 0.0, 1, 1, 0, "RMSC-Track Oval Stadium Dag Out 2 (Found in Station)"],
    [939, "250", "Airconditioner", "Aircon Ceiling Type 5TR", "-", "unit", 0.0, 1, 1, 0, "RMSC-Track Oval Stadium Dag Out 3 (Found in Station)"],
    [940, "250", "Airconditioner", "Wall mounted, 2HP", "2025-II-1-1264", "unit", 75000.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [941, "250", "Airconditioner", "3TR Floor Mounted Carrier L-Series tyoe Aircon, M: ASBFM360BA, SN: 0498847", "2008-II-1-622", "unit", 69770.0, 1, 1, 0, "RMSC-Admin Bldg. 4th floor Room 401 (Chairman's Office)"],
    [942, "250", "Camera", "Camera Canon EOS 6D Mark II SN:232052000709 w/ Canon Zoom Lens EF 24.70mm 1:4L IS USM SN:6413000301 w/ extra battery 16G Mem. & Charger Adaptor", "19-VI-3-114", "unit", 140500.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [943, "250", "Camera", "Digital SLR Canon EOS 7D Mark II Kit sn:221054000827 / 18-135mm lens sn:3242033837 / 70mm-200mm sn:4010000905 / External Flash sn:4813102195 / Battery", "16-VI-3-103", "set", 258773.28, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"],
    [944, "250", "Camera", "Canon Camera EOS 800D 8-55mm DSLR, SN: 353073004631", "20-VI-3-133", "unit", 56250.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [945, "250", "Camera", "Canon EOS 7D Mark II, Professional camera with Battery & charger Adapter SN:335055000266 M:DS126461 with Lens EF-S 18-135mm SN: 5142008492", "17-VI-3-107", "set", 109000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [946, "250", "Camera", "Drone Camera, DJI MAVIC 2Pro", "20-VI-3-128", "unit", 117500.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [947, "250", "Camera", "DSLR Nikon Camera D600 24-85 VR KIT / w/ charger / battery / cable and camera strap / Lens: AF-S Nikkor 24-85 mm F/ 3.5-4.5G ED VR / Serial # Camera: ", "22-VI-3-136", "set", 75000.0, 1, 0, 0, "RMSC-Property Office Storage"],
    [948, "250", "Camera", "Digital SLR Camera w/ 18-135mm lens Canon EOS 7D Mark II Kit SN:241054002128 (body) sn:4302013326 (18-135mm lens) / Camera Lens Canon EFS 55-250mm SN:", "16-VI-3-099 / 100", "set", 102857.76, 1, 1, 0, "RMSC-Property Office Storage"],
    [949, "250", "Camera", "Camera Canon EOS 6D Mark II SN:191052000868 w/ Canon Zoom Lens EF 24.70mm 1:4L IS USM SN:6003000475 w/ extra battery 16G Mem. & Charger Adaptor", "19-VI-3-112", "unit", 140500.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [950, "250", "Camera", "Camera Canon EOS 6D Mark II SN:232052000876 w/ Canon Zoom Lens EF 24.70mm 1:4L IS USM SN:0413000405 w/ extra battery 16G Mem. & Charger Adaptor", "19-VI-3-113", "unit", 140500.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [951, "250", "Camera", "Digital Camera, Sony A7, M: ILCE-7M4, SN: 532631", "2025-VI-3-138", "unit", 447300.0, 1, 1, 0, "RMSC-Admin Bldg. 4th Floor Room 407 (PCO Office)"],
    [952, "250", "Car Barrier", "4.5 mtr Car Barrier, All Steel Body Aluminum Boom Maximum Arm Length 4.5m (14.76ft), Operated via Push Button Control (inclusive), Extremely Durable: ", "19-X-199", "set", 343000.0, 1, 1, 0, "RMSC-Engineering/RMSC Entrance Gate"],
    [953, "250", "Car Barrier", "4.5 mtr Car Barrier, All Steel Body Aluminum Boom Maximum Arm Length 4.5m (14.76ft), Operated via Push Button Control (inclusive), Extremely Durable: ", "19-X-200", "set", 343000.0, 1, 1, 0, "RMSC-Engineering/Inside RMSC Compound"],
    [954, "250", "Car Barrier", "4.5 mtr Car Barrier, All Steel Body Aluminum Boom Maximum Arm Length 4.5m (14.76ft), Operated via Push Button Control (inclusive), Extremely Durable: ", "19-X-201", "set", 343000.0, 1, 1, 0, "RMSC-Engineering/ NAS Entrance Gate"],
    [955, "250", "Car Barrier", "4.5 mtr Car Barrier, All Steel Body Aluminum Boom Maximum Arm Length 4.5m (14.76ft), Operated via Push Button Control (inclusive), Extremely Durable: ", "19-X-202", "set", 343000.0, 1, 1, 78400, "Philsports-Engineering-Philsports MPA Entrance Gate"],
    [956, "250", "Ceiling Fan", "HLVS Industrial Ceiling Fan (5 Fan Blade, 11ft Lenght Color: Gray )", "18-II-2-1270", "unit", 370000.0, 1, 1, 0, "RMSC-Gymnastic Gym"],
    [957, "250", "Control Panel w/ Cabinet", "Complete Pole Mounted Systems for Video and Audio Switching, Control and Projector Mounting", "08-VI-1-119", "set", 198000.0, 1, 1, 0, "Philsports-BLDG A. AVR 2nd flr (Room 201)"],
    [958, "250", "Electric Timer Shot Clock", "Fair Play", "24-X-209 to 210", "units", 264000.0, 2, 2, 0, "Philsports-MPA (Stock Room)"],
    [959, "250", "Gym Equipment", "Speed Professional Video Camera SN:422019800023", "20-XI-3-935", "unit", 349893.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [960, "250", "Gym Equipment", "Speed Professional Video Camera SN:422019800125", "20-XI-3-936", "unit", 349893.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [961, "250", "Gym Equipment", "Speed Professional Video Camera SN:422019800123", "20-XI-3-937", "unit", 349893.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [962, "250", "Gym Equipment", "Professional Video Camera SN:2207579", "20-XI-3-986", "unit", 362137.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [963, "250", "Gym Equipment", "Professional Video Camera SN:2207209", "20-XI-3-987", "unit", 362137.0, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [964, "250", "Gym Equipment", "Professional Video Camera SN: 2207585", "20-XI-3-988", "unit", 362137.0, 1, 1, 0, "RMSC-MSAS Building Ground Floor"],
    [965, "250", "Gym Equipment", "Underwater Camera (Composed of: 4 long Bags w/ Underwater Camera ,1 small Bags w/ Underwater Camera and 1 Brief case for Accessories)", "20-XI-3-938", "lot", 1720355.46, 1, 1, 0, "Philsports-MSAS Building Sports Physiology Unit"],
    [966, "250", "Ice Maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "22-II-3-096", "unit", 172000.0, 1, 0, 0, "Philsports-MSAS Building Ground Floor"],
    [967, "250", "Ice Maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "22-II-3-098", "unit", 95000.0, 1, 0, 0, "PSC Baguio-MSAS"],
    [968, "250", "Ice Maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "22-II-3-097", "unit", 95000.0, 1, 0, 0, "RMSC- MSAS Office"],
    [969, "250", "Ice Maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "22-II-3-095", "unit", 172000.0, 1, 0, 0, "RMSC- MSAS Office"],
    [970, "250", "Inflatable Arch", "Inflatable Arch with Replaceable Signage", "18-XI-3-873", "set", 260000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [971, "250", "Kiosk Portrait", "Customized Floor Standing Digital Kiosk", "19-X-203", "unit", 155000.0, 1, 1, 0, "RMSC-Canteen"],
    [972, "250", "Kiosk Portrait", "Customized Floor Standing Digital Kiosk", "19-X-204", "unit", 155000.0, 1, 1, 0, "RMSC-Lobby (c/o Public Communication Office)"],
    [973, "250", "Lawn Mower", "Ride-On Lawn Mower, Brand Name: HUSQVVARNA, M:TC-342 SN:062116D004368", "17-VII-1-059", "unit", 285096.6, 1, 1, 0, "RMSC-Baseball Stadium"],
    [974, "250", "LED Display", "P 5.95 Outdoor Slim Alum. LED Display/ Physical pixel pitch: 5.95mm/ Cabinet size: 1000mm(h) x 500mm(w) x 65mm(t)/ Cabinet qty: 5(h) x 12(w)= 60 cabin", "20-VI-2-224", "set", 3065000.0, 1, 1, 0, "RMSC- Main Gate"],
    [975, "250", "LED Display", "P 5.95 Outdoor Slim Alum. LED Display/ Physical pixel pitch: 5.95mm/ Cabinet size: 1000mm(h) x 500mm(w) x 65mm(t)/ Cabinet qty: 5(h) x 12(w)= 60 cabin", "22-VI-2-228", "set", 3065000.0, 1, 1, 0, "Philsports-MPA Main Gate"],
    [976, "250", "Microphone", "Dual Wireless Handheld Microphone Shure BLX 288 / 5M58", "19-VI-1-240", "unit", 54600.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [977, "250", "Oiling Machine", "Kegel Flex Bowling Oiling machine (230V/50Hz) Black w/ Lithium ion Battery 25.6 AH", "17-XI-3-871", "set", 1525410.27, 1, 1, 0, "Star Mall Alabang - PSC Bowling Center"],
    [978, "250", "Projector", "NEC VT 695 Multimedia LCD Projector SN: 8143876FJ", "08-VI-2-126", "unit", 50000.0, 1, 1, 0, "Philsports-Building A 4th floor room 404 (PSI Office)"],
    [979, "250", "Projector", "NEC VT 695 Multimedia LCD Projector w/ Screen SN: 8143878FJ", "08-VI-2-127 / 127A", "set", 50000.0, 1, 1, 0, "Philsports-Building A 4th floor room 405 (PSI Office)"],
    [980, "223", "Projector", "Panasonic PT-VW540,5500 Lumens / VEGA Deluxe 72\"x96\" (HxW) Motorized Projector Screen w/ Accessories, SN: DC9510112", "19-VI-3-122", "set", 173500.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [981, "223", "Projector", "Panasonic PT-VW540,5500 Lumens / VEGA Deluxe 72\"x96\" (HxW) Motorized Projector Screen w/ Accessories", "19-VI-3-123", "set", 173500.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [982, "223", "Projector", "Panasonic PT-VW540,5500 Lumens / VEGA Deluxe 90\"x120\" (HxW) Motorized Projector Screen w/ Accessories, SN: DC9510230", "19-VI-3-121", "set", 176500.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [983, "250", "Projector", "Acer Projector M:P5330W SN:MRJPJ11007801002DA5900", "19-VI-3-111", "unit", 62999.0, 1, 1, 0, "RMSC-Swimming Pool (PHINADO)"],
    [984, "250", "Pump", "Submersible Pump SN:3085.183-1753-1710161", "18-VIII-3-084", "unit", 200624.0, 1, 1, 0, "RMSC-Engineering/Maint Athlete's Quarter-North & South Tower"],
    [985, "250", "Pump motor", "Motor Pump,10 HP 120 GPM Pump, 50mm x 32mm", "19-VIII-3-088", "unit", 199500.0, 1, 1, 0, "RMSC-Engineering/Maint Office (Pumping Station) / DEFECTIVE"],
    [986, "250", "Pump Motor", "Submersible Pump 2.2kw (3HP) 230v /460v 3 Phase, 60Hz Class H Insulation", "21-VIII-3-089", "unit", 205500.0, 1, 0, 0, "RMSC-Engineering/Maint Athlete's Quarter-North & South Tower"],
    [987, "250", "Pump motor", "Submersible Pump 2.2kw (3HP) 230v /460v 3 Phase, 60Hz Class H Insulation", "2021-VIII-3-090", "unit", 205500.0, 1, 0, 0, "RMSC-Engineering/Maint Athlete's Quarter-North & South Tower"],
    [988, "250", "Pump motor", "Teco 3 Phase Induction Motor (End Suction Centrifugal Pump) Type: AEEFYC101 S/N: P422B083010 Cast Iron Construction Pump/ Volute Housing, Bronze Umpel", "2023-VIII-3-101", "unit", 136242.0, 1, 1, 0, "RMSC-Engineering/Maint Office (Pumping Station)"],
    [989, "250", "Pump motor", "Soft Starter Controller 10hp , 230v, 3 Phase, 60Hz with Soft Starter, Circuit Breaker, Contactor, Thermal Overload Relay, Push Button, Pilot Lights & ", "2023-VIII-3-102", "unit", 164199.0, 1, 1, 0, "RMSC-Engineering/Maint Office (Pumping Station)"],
    [990, "250", "Pump motor", "7.5HP Centrifugal Pump, Gould Closed Coupled Centrifugal Pump SN:RD318149BF23-05", "2023-VIII-3-103", "unit", 97500.0, 1, 1, 0, "Philsports-MPA Arena (Back of Swimming pool)"],
    [991, "250", "Pump motor", "7.5HP Centrifugal Pump, Gould Closed Coupled Centrifugal Pump SN:RD3088DBF22-08", "2023-VIII-3-104", "unit", 97500.0, 1, 1, 0, "Philsports-MPA Arena (Back of Diving pool)"],
    [992, "250", "Speaker", "Dual 15\" Powered Loudspeaker 1500W, JBL PERX 825W", "19-VI-1-234", "unit", 105000.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [993, "250", "Speaker", "Dual 15\" Powered Loudspeaker 1500W, JBL PERX 825W", "19-VI-1-237", "unit", 105000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Conference Room )"],
    [994, "250", "Speaker", "Dual 15\" Powered Loudspeaker 1500W, JBL  ", "22-VI-1-245", "unit", 89500.0, 1, 1, 0, "Philsports-Building A, AVR, room 101"],
    [995, "250", "Speaker", "Dual 15\" Powered Loudspeaker 1500W, JBL  ", "22-VI-1-246", "unit", 89500.0, 1, 1, 0, "Philsports-Building A, AVR, room 101"],
    [996, "250", "Tank", "FRP Vertical Cylindrical Water Storage Tank / (fabricated) Technical Specification: Inside Diameter: 1500 mm Height: 2440 mm/ 8 ft. Thickness: 5-5 mm ", "21-VIII-3-091", "unit", 150000.0, 1, 1, 0, "PSC Baguio-Barrows Laundry"],
    [997, "250", "Tank", "FRP Vertical Cylindrical Water Storage Tank / (fabricated) Technical Specification: Inside Diameter: 1500 mm Height: 2440 mm/ 8 ft. Thickness: 5-5 mm ", "21-VIII-3-092", "unit", 150000.0, 1, 1, 0, "PSC Baguio-Barrows Laundry"],
    [998, "250", "Tank", "FRP Vertical Cylindrical Water Storage Tank / (fabricated) Technical Specification: Inside Diameter: 1500 mm Height: 2440 mm/ 8 ft. Thickness: 5-5 mm ", "21-VIII-3-093", "unit", 150000.0, 1, 1, 0, "PSC Baguio"],
    [999, "250", "Tank", "FRP Vertical Cylindrical Water Storage Tank / (fabricated) Technical Specification: Inside Diameter: 1500 mm Height: 2440 mm/ 8 ft. Thickness: 5-5 mm ", "21-VIII-3-094", "unit", 150000.0, 1, 1, 0, "PSC Baguio-Multipurpose 5th Floor"],
    [1000, "250", "Tank", "FRP Vertical Cylindrical Water Storage Tank / (fabricated) Technical Specification: Inside Diameter: 1500 mm Height: 2440 mm/ 8 ft. Thickness: 5-5 mm ", "21-VIII-3-095", "unit", 150000.0, 1, 1, 0, "PSC- Baguio, MSAS"],
    [1001, "250", "TELEPROMPTER", "TELEPROMPTER 20 inch LCD display, VGA or HDMI Cable, Camera bracket, Imported Glass Mirror (46*48cm), Wireless remote", "21-VI-2-226", "set", 60000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [1002, "250", "Television", "Television LG 55\" M:55SK8000PPA SN:812INTX5S097", "19-VI-2-195", "unit", 75000.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 401 (Chairman's Office)"],
    [1003, "250", "Television", "Devant, LED TV 55", "13-VI-2-144", "unit", 63000.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [1004, "250", "Television", "Devant, LED TV 55", "13-VI-2-145", "unit", 63000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Conference Room )"],
    [1005, "250", "Television", "65\" Television Sony HD - 65X7500D 4K Android TV SN:7301421", "17-VI-2-187", "unit", 73599.0, 1, 1, 0, "Philsports-Bldg A. Ground Floor Room 106 (Chairman's Office)"],
    [1006, "250", "Television", "Sony FW-55BZ35F 55\" 4K Professional Display, SN: 5002457", "19-VI-3-124", "set", 84500.0, 1, 1, 0, "RMSC-Planning & Program Division"],
    [1007, "250", "Television", "TCL 43\" SN:1908ALY143999F00149", "19-VI-2-222", "unit", 80000.0, 1, 1, 0, "RMSC-Tennis Center Athletes and Coaches Lounge"],
    [1008, "250", "Television", "TCL 43\" SN:1908ALY143999F00147", "19-VI-2-223", "unit", 80000.0, 1, 1, 0, "RMSC-Admin Bldg. 3rd Floor Operations Office"],
    [1009, "250", "Television", "TCL 43\" SN:1908ALY143999F00145", "19-VI-2-216", "unit", 80000.0, 1, 1, 0, "PSC Baguio-Multipurpose Dormitory 3rd Floor"],
    [1010, "250", "Television", "TCL 43\" SN:1908ALY143999F00150", "19-VI-2-217", "unit", 80000.0, 1, 1, 0, "PSC Baguio-Barrows Hall"],
    [1011, "250", "Television", "TCL 43\" SN:1908ALY143999F00105", "19-VI-2-218", "unit", 80000.0, 1, 1, 0, "PSC Baguio-Dormitory Office"],
    [1012, "250", "Television", "TCL 43\" SN:1908ALY143999F00089", "19-VI-2-219", "unit", 80000.0, 1, 1, 0, "RMSC-Dormitory Office Stock Room"],
    [1013, "250", "Television", "TCL 43\" SN:1908ALY143999F00146", "19-VI-2-220", "unit", 80000.0, 1, 1, 0, "Philsports-Dorm F (402)"],
    [1014, "250", "Television", "TCL 43\" SN:1908ALY143999F00148", "19-VI-2-221", "unit", 80000.0, 1, 1, 0, "Philsports-MSAS Building 2nd Floor"],
    [1015, "250", "Television", "TCL LED 65P8SUS 4K UHD Smart TV SN: GLY144502N-000066", "SEAG-AV-003-2019", "unit", 72030.0, 1, 1, 0, "RMSC-Admin Bldg. Lobby Ground Floor"],
    [1016, "250", "Television", "TCL LED 65P8SUS 4K UHD Smart TV ", "SEAG-AV-005-2019", "unit", 72030.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [1017, "250", "Tent", "Fabric Warp Polyester 100 dtex Size 5m x 10m", "18-VIII-7-429", "unit", 220000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [1018, "250", "Tent", "Fabric Warp Polyester 100 dtex Size 6m x 10m", "18-VIII-7-430", "unit", 245000.0, 1, 1, 0, "Philsports-Property Office Storage"],
    [1019, "250", "Timer", "LED FUN RUN TIMER (3K,5K,10K) Dimension: 72\"(w) x 16\"(h) x 3\"(d)", "19-X-196", "unit", 68000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [1020, "250", "Timer", "LED FUN RUN TIMER (3K,5K,10K) Dimension: 72\"(w) x 16\"(h) x 3\"(d)", "19-X-197", "unit", 68000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [1021, "250", "Timer", "LED FUN RUN TIMER (3K,5K,10K) Dimension: 72\"(w) x 16\"(h) x 3\"(d)", "19-X-198", "unit", 68000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [1022, "250", "Tools", "Knock Out Punch, Ridgid,w/ hand pump(com.set)M:HKO-186", "15-VIII-1-057", "unit", 62950.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Engineering and Maintenance Office)"],
    [1023, "250", "Transport", "150cm w/ 2 Granks & Pole", "99-XI-3-181", "unit", 79887.0, 1, 1, 0, "Philsports-MPA (Stock Room)"],
    [1024, "250", "Vacuum Cleaner", "Vacuum Cleaner Wet & Dry, HD 1000w, 70L, Motor", "18-VII-3-085", "unit", 128357.0, 1, 1, 0, "RMSC-Transportation Unit"],
    [1025, "250", "Vault", "Heavy Duty Steel Vault 31.5\"H x 23.6\"W x 22.4\"D sn:LP101882 000014 2118", "17-I-5-508", "unit", 58599.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [1026, "250", "Vault", "Heavy Duty Steel Vault 31.5\"H x 23.6\"W x 22.4\"D sn:LP101882 000028 2118", "17-I-5-509", "unit", 58599.0, 1, 1, 0, "RMSC-Admin Bldg. 2nd Floor Room 209 (Cashier Office)"],
    [1027, "250", "Vault", "Heavy Duty Steel Vault 31.5\"H x 23.6\"W x 22.4\"D sn:LP101882 000004 2118", "17-I-5-507", "unit", 58599.0, 1, 1, 0, "Philsports-Bldg. A, Ground Floor Room 104 (Cashier's Office)"],
    [1028, "250", "Video Camera", "Video Camera Recorder Panasonic M:AG-AC30 SN:L8TKA0053", "19-VI-3-117", "unit", 111000.0, 1, 1, 0, "Philsports-Bldg A. 4th Floor Room 406 (PSI Office)"],
    [1029, "250", "Video Camera", "Video Camera Semi-Pro Panasonic AC-30 w/ accessories SN:F7TKA0085 M:AG-AC30", "17-V-2-188", "set", 86500.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [1030, "250", "Video Camera", "Video Camera Recorder, Panasonic, Model: AG-AC30PJ, Serial No.: H1TKA-146", "22-VI-3-137", "set", 111000.0, 1, 1, 0, "RMSC-Property Office Storage"],
    [1031, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer ", "19-XI-7-183", "unit", 251890.0, 1, 1, 0, "PSC Baguio Barrows Laundry"],
    [1032, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer", "19-XI-7-184", "unit", 251890.0, 1, 1, 0, "PSC Baguio Barrows Laundry"],
    [1033, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer", "19-XI-7-185", "unit", 251890.0, 1, 1, 0, "PSC Baguio Barrows Laundry"],
    [1034, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN: M74501494", "19-XI-7-173", "unit", 251890.0, 1, 1, 0, "Philsports-Laundry Area"],
    [1035, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN: M74501475", "19-XI-7-174", "unit", 251890.0, 1, 1, 0, "Philsports-Laundry Area"],
    [1036, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN: M74501487", "19-XI-7-175", "unit", 251890.0, 1, 1, 0, "Philsports-Laundry Area"],
    [1037, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN: M74501493", "19-XI-7-176", "unit", 251890.0, 1, 1, 0, "Philsports-Laundry Area"],
    [1038, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN: M74501480", "19-XI-7-177", "unit", 251890.0, 1, 1, 0, "Philsports-Laundry Area"],
    [1039, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN:M74501466", "19-XI-7-179", "unit", 251890.0, 1, 1, 0, "RMSC-Tennis Center/Dormitory (Laundry Area)"],
    [1040, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN:M74501472", "19-XI-7-180", "unit", 251890.0, 1, 1, 0, "RMSC-Tennis Center/Dormitory (Laundry Area)"],
    [1041, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN:M74501485", "19-XI-7-181", "unit", 251890.0, 1, 1, 0, "RMSC-Tennis Center/Dormitory (Laundry Area)"],
    [1042, "250", "Washing Machine", "Commercial Laundry Machine / Stack Front Load Washer Dryer SN:M74501500", "19-XI-7-182", "unit", 251890.0, 1, 1, 0, "RMSC-Tennis Center/Dormitory (Laundry Area)"],
    [1043, "250", "Washing Machine", "Washing Machine M:LG FC1450H1V SN:804PNBM4A125", "18-XI-7-168", "unit", 89000.0, 1, 1, 0, "RMSC-MSAS Laundry Room"],
    [1044, "250", "Washing Machine", "Front Load Washer, 15 kg, Black, Brand: LG Thin Q, SN: 502PNDWKFQT69", "2025-XI-7-188", "unit", 52500.0, 1, 1, 0, "Philsports-MSAS Building"],
    [1045, "250", "Washing Machine", "Front Load Washer, 15 kg, Black, Brand: LG Thin Q, SN: 502PNDWFQ658", "2025-XI-7-186", "unit", 52500.0, 1, 1, 0, "RMSC-MSAS Building"],
    [1046, "250", "Washing Machine", "Heavy duty, 10.5 kg", "2025-XI-7-190", "unit", 51500.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [1047, "250", "Washing Machine", "Whirlpool SN:C71680466", "2017-XI-7-166", "unit", 54495.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [1048, "250", "Dryer", "Heat Pump Dryer, 10 kg, Black, Brand: LG Thin Q, SN: 502KWZH7M381", "2025-XI-7-187", "unit", 52900.0, 1, 1, 0, "RMSC-MSAS Building"],
    [1049, "250", "Dryer", "Heat Pump Dryer, 10 kg, Black, Brand: LG Thin Q, SN: 502KWZH7M405", "2025-XI-7-189", "unit", 52900.0, 1, 1, 0, "Philsports-MSAS Building"],
    [1050, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-099", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1051, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-100", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1052, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-101", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1053, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-102", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1054, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-103", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1055, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-104", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1056, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-105", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1057, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-106", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1058, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-107", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1059, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-108", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1060, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-120 Power: 220-60Hz 710W Refrigerant", "23-II-3-109", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1061, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "23-II-3-110", "unit", 172000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1062, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "23-II-3-111", "unit", 172000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1063, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "23-II-3-112", "unit", 172000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1064, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "23-II-3-113", "unit", 172000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1065, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "23-II-3-114", "unit", 172000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1066, "250", "Ice maker", "Cmerpai Ice Maker Model: CME-180 Power: 220-60Hz 950W Refrigerant", "23-II-3-115", "unit", 172000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1067, "250", "Ice maker", "Cmerpai Ice Maker 48kg., Model: HY280p Refrigerant", "23-II-3-116", "unit", 57000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1068, "250", "Ice maker", "Cmerpai Ice Maker 48kg., Model: HY280p Refrigerant", "23-II-3-117", "unit", 57000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1069, "250", "Ice maker", "Cmerpai Ice Maker 48kg., Model: HY280p Refrigerant", "23-II-3-118", "unit", 57000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1070, "250", "Ice maker", "Cmerpai Ice Maker 48kg., Model: HY280p Refrigerant", "23-II-3-119", "unit", 57000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1071, "250", "Ice maker", "Cmerpai Ice Maker 90kg., Model: GQ-90 Refrigerant", "23-II-3-120", "unit", 82000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1072, "250", "Ice maker", "Cmerpai Ice Maker 90kg., Model: GQ-90 Refrigerant", "23-II-3-121", "unit", 82000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1073, "250", "Ice maker", "Cmerpai Ice Maker 120kg. Refrigerant", "23-II-3-122", "unit", 98000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1074, "250", "Ice maker", "Cmerpai Ice Maker 120kg. Refrigerant", "23-II-3-123", "unit", 98000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1075, "250", "Ice maker", "Cmerpai Ice Maker 120kg. Refrigerant", "23-II-3-124", "unit", 98000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1076, "250", "Ice maker", "Cmerpai Ice Maker 250kg. Refrigerant", "23-II-3-125", "unit", 155000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1077, "250", "Ice maker", "Cmerpai Ice Maker 250kg. Refrigerant", "23-II-3-126", "unit", 155000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1078, "250", "Ice maker", "Cmerpai Ice Maker 500kg. Refrigerant", "23-II-3-127", "unit", 270000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1079, "250", "Ice maker", "Cmerpai Ice Maker Model: GQ380 Refrigerant", "23-II-3-128", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1080, "250", "Ice maker", "Cmerpai Ice Maker Model: GQ380 Refrigerant", "23-II-3-129", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1081, "250", "Ice maker", "Cmerpai Ice Maker Model: DLX40 Refrigerant", "23-II-3-130", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1082, "250", "Ice maker", "Cmerpai Ice Maker Model: DLX60 Refrigerant", "23-II-3-131", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1083, "250", "Ice maker", "Cmerpai Ice Maker Model: DLX90 Refrigerant", "23-II-3-132", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1084, "250", "Ice maker", "Cmerpai Ice Maker Model: SK IM-100 Refrigerant", "23-II-3-133", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1085, "250", "Ice maker", "Cmerpai Ice Maker Model: BG-80 Refrigerant", "23-II-3-134", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1086, "250", "Ice maker", "Cmerpai Ice Maker Model: BG-80 Refrigerant", "23-II-3-135", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1087, "250", "Ice maker", "Cmerpai Ice Maker Model: BG-80 Refrigerant", "23-II-3-136", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1088, "250", "Ice maker", "Cmerpai Ice Maker Model: EZ AIR HIS-050KB Refrigerant", "23-II-3-137", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1089, "250", "Ice maker", "Cmerpai Ice Maker Model: EZ AIR HIS-050KB Refrigerant", "23-II-3-138", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1090, "250", "Ice maker", "Cmerpai Ice Maker Model: EZ AIR HIS-050KB Refrigerant", "23-II-3-139", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1091, "250", "Ice maker", "Cmerpai Ice Maker Model: EZ AIR HIS-050KB Refrigerant", "23-II-3-140", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1092, "250", "Ice maker", "Cmerpai Ice Maker Model: EZ AIR HIS-050KB Refrigerant", "23-II-3-141", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1093, "250", "Ice maker", "Cmerpai Ice Maker Model: EZ AIR HIS-050KB Refrigerant", "23-II-3-142", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1094, "250", "Ice maker", "Cmerpai Ice Maker Model: BY-550F Refrigerant", "23-II-3-143", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1095, "250", "Ice maker", "Cmerpai Ice Maker Model: BY-550F Refrigerant", "23-II-3-144", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1096, "250", "Ice maker", "Cmerpai Ice Maker Model: BY-550F Refrigerant", "23-II-3-145", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1097, "250", "Ice maker", "Cmerpai Ice Maker Model: BY-550F Refrigerant", "23-II-3-146", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1098, "250", "Ice maker", "Cmerpai Ice Maker Model: HZB-50 Refrigerant", "23-II-3-147", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1099, "250", "Ice maker", "Cmerpai Ice Maker Model: HZB-50 Refrigerant", "23-II-3-148", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1100, "250", "Ice maker", "Cmerpai Ice Maker Model: HZB-50 Refrigerant", "23-II-3-149", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1101, "250", "Ice maker", "Cmerpai Ice Maker Model: BG-100 Refrigerant", "23-II-3-150", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1102, "250", "Ice maker", "Cmerpai Ice Maker Model: BG-100 Refrigerant", "23-II-3-151", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1103, "250", "Ice maker", "Cmerpai Ice Maker Model: HY 120, 700kg Refrigerant", "23-II-3-152", "unit", 335000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1104, "250", "Ice maker", "Cmerpai Ice Maker Model: HY 120, 700kg Refrigerant", "23-II-3-153", "unit", 335000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1105, "250", "Ice maker", "Cmerpai Ice Maker Model: BG-100 Refrigerant", "23-II-3-154", "unit", 134103.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1106, "250", "Ice maker", "Ice Maker CME-120", "23-II-3-155", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1107, "250", "Ice maker", "Ice Maker CME-120", "23-II-3-156", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1108, "250", "Ice maker", "Ice Maker CME-120", "23-II-3-157", "unit", 95000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1109, "250", "Ice maker", "Ice Maker 120kg", "23-II-3-158", "unit", 98000.0, 1, 1, 0, "Maybunga Pasig Warehouse"],
    [1110, "250", "Camera", "Digital Camera, Sony ZV-1, SN: 4697150", "21-VI-3-135", "unit", 59300.0, 1, 1, 0, "RMSC-Admin BLDG. 4th Floor Room 409 (Public Communication Office)"],
    [1111, "250", "Machine", "Misting Machine UVL Cold Fog Generator SN: 9911704", "2023-VIII-7-442", "unit", 65000.0, 1, 1, 0, "RMSC-Admin BLDG. 3rd Floor Room 308 (Operation's Office)"],
    [1112, "250", "Pump", "Centrifugal Pump SN: 22090568FG ", "2024-VIII-3-105", "unit", 339004.0, 1, 1, 0, "RMSC-Pumping station"],
    [1113, "250", "Pump", "Centrifugal Pump SN: 23030497FC", "2024-VIII-3-106", "unit", 245645.0, 1, 1, 0, "RMSC-Pumping station"],
    [1114, "250", "Control Panel", "Automatic Sequential Motor Control Panel", "2024-VIII-3-107", "unit", 364806.0, 1, 1, 0, "RMSC-Pumping station"],
    [1115, "250", "Pump Motor", "Motor Pump Baldor Reliance (220-146v) SN: RD324053BF23-10", "2024-VIII-3-108", "unit", 384000.0, 1, 1, 0, "RMSC-Pumping station"],
    [1116, "250", "Pump Motor", "Motor Pump Baldor Reliance (220-146v) SN: RD325247BF23-11", "2024-VIII-3-109", "unit", 384000.0, 1, 1, 0, "RMSC-Pumping station"],
    [1117, "250", "Control Panel", "Automatic Sequential Motor Control Panel for 2 motors in Nema 3R (220-460V)", "2024-VIII-3-110", "unit", 291000.0, 1, 1, 0, "RMSC-Pumping station"],
    [1118, "250", "Pump Motor", "Motor Pump Baldor Reliance (220-380v( SN: RD322807BF23-09", "2024-VIII-3-111", "unit", 155700.0, 1, 1, 0, "RMSC-MSAS Building"],
    [1119, "250", "Pump Motor", "Motor Pump Baldor Reliance (220-380v( SN: RD332350BF24-04", "2024-VIII-3-112", "unit", 155700.0, 1, 1, 0, "RMSC-MSAS Building"],
    [1120, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 33824J2ML000003606", "2025-VIII-3-114", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1121, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 12924J2ML000000443", "2025-VIII-3-115", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1122, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 33824J2ML000003412", "2025-VIII-3-116", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1123, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 06124J2ML000001835", "2025-VIII-3-117", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1124, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 06124J2ML000001806", "2025-VIII-3-118", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1125, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 12924J2ML000000415", "2025-VIII-3-119", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1126, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 06124J2ML000001862", "2025-VIII-3-120", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1127, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 12924J2ML000000478", "2025-VIII-3-121", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1128, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 33824J2ML000003455", "2025-VIII-3-122", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1129, "250", "Pump Motor", "Hayward Super II PUMP Pool Filtration Motor Pump SN: 33824J2ML000003649", "2025-VIII-3-123", "unit", 95500.0, 1, 1, 0, "RMSC-Swimming Pool "],
    [1130, "250", "Control Panel", "Automatic Sequential Motor Control Panel for 2 motors in Nema 3R (220-380V)", "2024-VIII-3-113", "unit", 195000.0, 1, 1, 0, "RMSC-MSAS Building"],
    [1131, "250", "Circuit Breaker", "Schneider Molded Case, Circuit Breaker", "2024-VIII-2-033", "unit", 116400.0, 1, 1, 0, "RMSC-Engineering Office"],
    [1132, "250", "Circuit Breaker", "Schneider Molded Case, Circuit Breaker", "2024-VIII-2-034", "unit", 116400.0, 1, 1, 0, "RMSC-Ninoy Aquino Stadium"],
    [1133, "250", "Circuit Breaker", "Molded case circuit breaker with 6pcs lugs L type", "2025-VIII-2-035", "unit", 121775.0, 1, 1, 0, "RMSC-Football Stadium (South Tower)"],
    [1134, "250", "Circuit Breaker", "Molded case circuit breaker with 6pcs lugs L type", "2025-VIII-2-036", "unit", 121775.0, 1, 1, 0, "RMSC-Football Stadium (South Tower)"],
    [1135, "250", "Circuit Breaker", "Molded case circuit breaker with 6pcs lugs L type", "2025-VIII-2-037", "unit", 121775.0, 1, 1, 0, "RMSC-Football Stadium (South Tower)"],
    [1136, "250", "Circuit Breaker", "Molded case circuit breaker with 6pcs lugs L type", "2025-VIII-2-038", "unit", 121775.0, 1, 1, 0, "RMSC-Football Stadium (South Tower)"],
    [1137, "250", "Circuit Breaker", "Square-D Circuit Breaker", "2025-VIII-2-039", "unit", 150000.0, 1, 1, 0, "RMSC-Property Warehouse (Defective/For Disposal)"],
    [1138, "250", "Airconditioner", "3TR,  8-way Cassette Inverter, Airconditioning unit, SN: E0477A987302W00008", "2024-II-1-1248", "unit", 212000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Conference Room )"],
    [1139, "250", "Airconditioner", "3TR,  8-way Cassette Inverter, Airconditioning unit, SN: E0477A987302W00022", "2024-II-1-1249", "unit", 212000.0, 1, 1, 0, "RMSC-Admin BLDG. Ground Floor (Conference Room )"],
    [1140, "250", "Gong", "Brass Gong, Large, 25\"-30\" Diameter with stand and Gong Stricker", "2024-XI-3-1057", "unit", 76500.0, 1, 1, 0, "Maybunga Warehouse"],
    [1141, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-340", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1142, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-341", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1143, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-342", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1144, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-343", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1145, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-344", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1146, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-345", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1147, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-346", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1148, "250", "Lights", "Flood Light, High Quality LED, M: LF-FDB320", "2025-II-11-347", "unit", 105986.0, 1, 1, 0, "Rizal Memorial Coliseum"],
    [1149, "250", "Intercom", "Handset Intercom System", "2025-VI-1-248", "unit", 118100.0, 1, 1, 0, "Philsports, PSI"],
    [1150, "250", "Signs", "Electronic Exit Signs", "2025-VI-2-229", "unit", 51900.0, 1, 1, 0, "Philsports, PSI"],
    [1151, "250", "Projector", "Multimedia LCD Projector", "08-VI-2-128", "unit", 50000.0, 1, 1, 0, "Philsports, PSI"],
    [1152, "250", "Logo", "Philsports Logos", "2025-VI-2-230", "lot", 1198147.0, 1, 1, 0, "Philsports Complex"],
    [1153, "211", "Building", "Repair/Rehab of Boardroom located at 4F Admin Bldg.", "PSC-1004-001-A", "lot", 620780.67, 1, 1, 0, "RMSC Admin Building"],
    [1154, "211", "Building", "Upgrading of Gymnastics Gym", "PSC-1004-004-A", "lot", 4351885.65, 1, 1, 0, "RM Gymnastics Gym"],
    [1155, "211", "Building", "Upgrading of Gymnastics Gym", "PSC-1004-004-A", "lot", 3814562.41, 1, 1, 0, "RM Gymnastics Gym"],
    [1156, "211", "Building", "Renovation of PSC Bowling Center", "PSC-1004-019-A", "lot", 1877036.39, 1, 1, 0, "RM Bowling Center"],
    [1157, "211", "Building", "Importation of Bowling Materials (Laminated Flooring of Bowling Areas)", "PSC-1004-019-A", "lot", 8328930.62, 1, 1, 0, "RM Bowling Center"],
    [1158, "211", "Building", "Re-roofing of Baseball Stadium & Replacement of Wooden Seat Bleachers", "PSC-1004-023-B", "lot", 6475200.0, 1, 1, 0, "Rizal Memorial Baseball Stadium"],
    [1159, "211", "Building", "Rehab of Baseball Stadium", "PSC-1004-023-B", "lot", 3278926.24, 1, 1, 0, "Rizal Memorial Baseball Stadium"],
    [1160, "211", "Building", "Conversion of PHRDC into Philsports Offices", "PSC-1600-001-A", "lot", 1999989.63, 1, 1, 0, "Philsports Admin Building"],
    [1161, "211", "Building", "Rehabilitation of Athletes Cottages at PSC Baguio Teacher's Camp", "PSC-2600-007-A", "lot", 2000000.0, 1, 1, 0, "PSC Baguio Training Area - Teachers Camp Baguio"],
    [1162, "215", "Other Structures", "Waterline Distribution System at PSC", "PSC-1004-000-A", "lot", 2038454.52, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1163, "215", "Other Structures", "Waterline Distribution System at PSC", "PSC-1004-000-A", "lot", 12455110.44, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1164, "215", "Other Structures", "Renovation of 2F Admin Building", "PSC-1004-001-A", "lot", 7945920.14, 1, 1, 0, "RMSC Admin Building"],
    [1165, "215", "Other Structures", "Extension of 2F Property Office", "PSC-1004-005-A", "lot", 4181724.19, 1, 1, 0, "Property Office"],
    [1166, "215", "Other Structures", "Fabrication & Installation of 7 Units Steel Gates at Track Oval Stadium, RMSC", "PSC-1004-021-A", "lot", 573831.65, 1, 1, 0, "RM Track and Football Field"],
    [1167, "215", "Other Structures", "Rehabilitation of Perimeter Fence w/ Steel Gates & Doors at Philsports Pasig", "2", "lot", 1469974.77, 1, 1, 0, "Philsports Complex, Pasig City"],
    [1168, "215", "Other Structures", "Repair/Renovation of Fencilng Hall Gym & Office Building at Philsports Pasig", "", "lot", 7914378.73, 1, 1, 0, "Philsports Dorm"],
    [1169, "215", "Other Structures", "Rehabilitation of Amphitheater and Landscaping Works at Philsports", "", "lot", 1463300.68, 1, 1, 0, "Amphitheater"],
    [1170, "215", "Other Structures", "Clubhouse Skeet & Trap", "PSC-1776-001-A", "lot", 5000000.0, 1, 1, 0, "BUCOR Shooting Range, Skeet and Trap Shooting Range"],
    [1171, "215", "Other Structures", "Rehabiltation of Track & Field at Teacher's Camp, Baguio City", "", "lot", 34662191.28, 1, 1, 0, "PSC Baguio Training Area - Teachers Camp Baguio"],
    [1172, "215", "Other Structures", "Repair/Renovation of Rizal Memorial Sports Complex Ground", "PSC-1004-000-A", "lot", 1829330.51, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1173, "215", "Other Structures", "Repair/Renovation of Rizal Memorial Sports Complex Ground", "PSC-1004-000-A", "lot", 952285.06, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1174, "215", "Other Structures", "Repair/Renovation of Rizal Memorial Sports Complex Ground", "PSC-1004-000-A", "lot", 2880829.35, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1175, "215", "Other Structures", "Construction of 244 LM Perimeter Steel Fence with 2 Gates & Pedestrian from Baseball Stadium to Badminton Hall", "PSC-1004-000-A", "lot", 6107175.66, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1176, "215", "Other Structures", "Construction of Water System at RMSC, Malate, Manila", "PSC-1004-000-A", "lot", 8009999.65, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1177, "215", "Other Structures", "Consruction of Water System at RMSC", "PSC-1004-000-A", "lot", 7817034.82, 1, 1, 0, "Rizal Memorial Sports Complex, Malate Manlia"],
    [1178, "215", "Other Structures", "Construction of New Septic Tank & Re-Piping of Main Sewer Line of Admin. Bldg.", "PSC-1004-001-A", "lot", 39000.0, 1, 1, 0, "RMSC Admin Building"],
    [1179, "215", "Other Structures", "Renovation of Electrical Works 3rd Flr. PSC Administration Building", "PSC-1004-001-A", "lot", 239062.5, 1, 1, 0, "RMSC Admin Building"],
    [1180, "215", "Other Structures", "Repair/Renovation of the 4th Flr. Admin. Building", "PSC-1004-001-A", "lot", 9119138.33, 1, 1, 0, "RMSC Admin Building"],
    [1181, "215", "Other Structures", "Final Payment for the Improvement of Main Distribution Panel at PSC Administration Building", "PSC-1004-001-A", "lot", 1816619.07, 1, 1, 0, "RMSC Admin Building"],
    [1182, "215", "Other Structures", "Full Payment for the Proposed Water Line System for RMSC Administration", "PSC-1004-001-A", "lot", 511917.17, 1, 1, 0, "RMSC Admin Building"],
    [1183, "215", "Other Structures", "Rehabilitation of Electrical System of 2nd Floor Admin Bldg.", "PSC-1004-001-A", "lot", 478919.26, 1, 1, 0, "RMSC Admin Building"],
    [1184, "215", "Other Structures", "Full Payment for the Rehabilitation/Repair of Electrical System Admin. Bldg. 2nd Flr.", "PSC-1004-001-A", "lot", 684170.38, 1, 1, 0, "RMSC Admin Building"],
    [1185, "215", "Other Structures", "Repair/Renovation of 4th Floor Admin Bldg. - 6th Billing", "PSC-1004-001-A", "lot", 333145.98, 1, 1, 0, "RMSC Admin Building"],
    [1186, "215", "Other Structures", "Rehabilitation of 3rd Floor & Various Works at RMSC Admin Building", "PSC-1004-001-A", "lot", 14950356.34, 1, 1, 0, "RMSC Admin Building"],
    [1187, "215", "Other Structures", "Repair/Replacement of Bleachers (Wooden) of the RMSC Basketball Coliseum", "PSC-1004-002-A", "lot", 1737760.95, 1, 1, 0, "RM Coliseum"],
    [1188, "215", "Other Structures", "Payment for the Variation Order No.1 for the Rehabilitation and Upgrading of Basketball Coliseum in RMSC, Malate, Manila, BR No.1728 (G)-2019 (Check N", "PSC-1004-002-A", "lot", 274519506.63, 1, 1, 0, "RM Coliseum"],
    [1189, "215", "Other Structures", "Rehabilitation of Badminton Hall in RMSC including Variation Order 1. (Completion Date: March 10, 2021)", "PSC-1004-003-A", "lot", 101978147.37, 1, 1, 0, "RM Badminton Hall (NSDF)"],
    [1190, "215", "Other Structures", "Rehabilitation of Roofing of Gymnastics Gym at RMSC", "PSC-1004-004-A", "lot", 1400000.0, 1, 1, 0, "RM Gymnastics Gym (NSDF)"],
    [1191, "215", "Other Structures", "Payment for the Supply, Delivery and Installation of Modular System of One (1) Storey Weightlifting Gym and One (1) Storey Aerobics Gym with Storage F", "PSC-1004-006-A", "lot", 6636000.0, 1, 1, 0, "PSC Wellness Gym (Weightlifting, Arnis, and Aero Gymnastics)"],
    [1192, "215", "Other Structures", "Construction of 10,000 Gallon Tank for Gymnastics Gym, PHILTA Swimming Pool and Boxing Gym", "PSC-1004-006-E", "lot", 2629399.97, 1, 1, 0, "Comfort Rooms Water Tank Area"],
    [1193, "215", "Other Structures", "Transfer of Completed Project - Dacudao Covered Court at Tennis Center, RMSC", "PSC-1004-006-F", "lot", 12167533.69, 1, 1, 0, "Dacudao Covered Court"],
    [1194, "215", "Other Structures", "Transfer to Asset Account Various Completed Projects Full Payment for the Supply, Delivery & Installation of Bleacher Seating Systems for Tennis Cover", "PSC-1004-006-J", "lot", 13750000.0, 1, 1, 0, "Open Courts 1 - 6"],
    [1195, "215", "Other Structures", "Rehabilitation and Upgrading of Rizal Memorial Tennis Center including Variation Order. (Completion Date: March 5, 2021)", "PSC-1004-006-J", "lot", 126881606.69, 1, 1, 0, "Open Courts 1 - 6"],
    [1196, "215", "Other Structures", "To Record to Property, Plant and Equipment Account the Construction in Progress Account regarding Upgrading of Swimming Pool, Diving Pool and Construc", "PSC-1004-007-A", "lot", 256189069.33, 1, 1, 0, "Swimming Pool Stadium"],
    [1197, "215", "Other Structures", "Construction of 14 Lanes Bowling Alley RMSC and Variation Order", "PSC-1004-008-A", "lot", 21922238.18, 1, 1, 0, "RM Bowling Center"],
    [1198, "215", "Other Structures", "Rehabilitation of Ninoy Aquino Stadium including Variation Order. BR 1728 (B) - 2019 (Completion Date: March 8, 2021)", "PSC-1004-009-A", "lot", 317528525.56, 1, 1, 0, "Ninoy Aquino Stadium"],
    [1199, "215", "Other Structures", "Full Payment (100% Billing) for the Renovation and Upgrading of Track Oval at RMSC (Check No. 448267 dtd. 12/03/2020) P 2,237,235.45", "PSC-1004-010-A", "lot", 47499691.18, 1, 1, 0, "RM Track And Football Stadium"],
    [1200, "215", "Other Structures", "Rehabilitation and Upgrading of Medical and Scientific Athletes Services Bldg. RMSC, Malate, Manila. (Completion Date: June 13, 2021)", "PSC-1004-012-A", "lot", 181632763.3, 1, 1, 0, "Sports Science Center/ MSAS Building"],
    [1201, "215", "Other Structures", "Rehabilitation of Baseball Field RMSC", "PSC-1004-013-B", "lot", 4452376.02, 1, 1, 0, "Baseball Field (11,808)"],
    [1202, "215", "Other Structures", "Rehabilitation of Central Pumping Station and Construction of New Water Service", "PSC-1004-014-A", "lot", 2350000.0, 1, 1, 0, "Central Pumping Station"],
    [1203, "215", "Other Structures", "Construction of Retaining Wall at PhilSports, Pasig City", "PSC-1600-000-A", "lot", 17112909.64, 1, 1, 0, "Philsports Complex, Pasig City"],
    [1204, "215", "Other Structures", "Supplementary Contract for the Conversion of PHRDC into Philsports, Pasig City", "PSC-1600-001-A", "lot", 2188707.76, 1, 1, 0, "Building A (Admin Building)"],
    [1205, "215", "Other Structures", "Improvement and Rehabilitation of All Comfort Rooms at Building A located at Philsports Complex, Pasig City", "", "lot", 2327329.5, 1, 1, 0, "Building A (Admin Building)"],
    [1206, "215", "Other Structures", "Renovation and Upgrading of Multi-Level Dining Hall including Variation Order No. 1 at Philsports, Pasig City BR No. 286-2020, 170 (B) (Completion Dat", "PSC-1600-006-A", "lot", 89191908.74, 1, 1, 0, "Dining Hall"],
    [1207, "215", "Other Structures", "Renovation of Dorm F at Philsports Complex, Pasig City", "PSC-1600-007-A", "lot", 12342926.65, 1, 1, 0, "Dorm F"],
    [1208, "215", "Other Structures", "Rehabilitation of Muay Thai Gym & Karatedo Gym at Philsports", "PSC-1600-007-A", "lot", 4670744.83, 1, 1, 0, "Dorm F"],
    [1209, "215", "Other Structures", "Rehabilitation of Muay Thai & Karatedo Gym", "PSC-1600-007-A", "lot", 300247.96, 1, 1, 0, "Dorm F"],
    [1210, "215", "Other Structures", "Full Payment of Billing (100%) for the Conversion of Dormitory G into Medical and Scientific Services (MSAS) Building located at Philsports Complex, M", "PSC-1600-008-A", "lot", 24433217.07, 1, 1, 0, "Dorm G/MSAS Building"],
    [1211, "215", "Other Structures", "Rehabilitation of Dorm \"J\" including Extra Work Order #1 located at PhilSports, Pasig City", "PSC-1600-011-A", "lot", 3939281.67, 1, 1, 0, "Dorm J"],
    [1212, "215", "Other Structures", "Construction of Phase I and II of PSC Fencing Hall, BR # 450 S. 1994", "PSC-1600-013-A", "lot", 6613898.8, 1, 1, 0, "Fencing Hall"],
    [1213, "215", "Other Structures", "Construction of Storage, Comfort Rooms and Fencing Hall at PSC-PNAS", "PSC-1600-013-A", "lot", 2667636.54, 1, 1, 0, "Fencing Hall"],
    [1214, "215", "Other Structures", "Upgrading of Swimming Pool, Diving Pool, Construction of New Bleacher, Warm-up Pool and Jacuzzi at Philsports Complex. (Completion Date: August 16, 20", "PSC-1600-014-A", "lot", 131154977.08, 1, 1, 0, "Philsports Swimming Center"],
    [1215, "215", "Other Structures", "Payment of L/C of Sports V Rubberize Surfacing Materials (PSC-Track Oval) ULTRA", "PSC-1600-015-A", "lot", 18257822.11, 1, 1, 0, "Philsports Track Oval"],
    [1216, "215", "Other Structures", "Repair/Renovation of Track and Field Stadium - Philsports", "PSC-1600-015-A", "lot", 2250000.0, 1, 1, 0, "Philsports Track Oval"],
    [1217, "215", "Other Structures", "Various Repairs of Dancesports Training Center & Waterproofing of Bleachers at Philsports", "PSC-1600-015-A", "lot", 5963627.5, 1, 1, 0, "Philsports Track Oval"],
    [1218, "215", "Other Structures", "Full Payment (100% Billing) for the Rehabilitation and Upgrading of Philsports Track Oval including Presidential Grandstand (Check No. 448275 dtd.12/0", "PSC-1600-015-A", "lot", 94620072.57, 1, 1, 0, "Philsports Track Oval"],
    [1219, "215", "Other Structures", "Rehabilitation/Retrofitting of Philsports Complex Open Bleachers including Variation Order 1 in Pasig City (Completion Date: February 26, 2021)", "PSC-1600-015-A", "lot", 65280446.22, 1, 1, 0, "Philsports Track Oval"],
    [1220, "215", "Other Structures", "Construction of New Lighting Tower and Lighting System at Ultra Track and Field, Philsports Complex Pasig City. (Completion Date: June 13, 2021)", "PSC-1600-015-A", "lot", 65643605.0, 1, 1, 0, "Philsports Track Oval"],
    [1221, "215", "Other Structures", "Rehab of T&G Flooring of MPA-Basketball Court", "PSC-1600-016-A", "lot", 1263057.0, 1, 1, 0, "Multi-Purpose Arena (MPA)"],
    [1222, "215", "Other Structures", "Rehabilitation and Upgrading of Philsports Arena including Variation Order., BR 1728 (B) - 2019, 497 - 2020. (Completion Date: March 1, 2021)", "PSC-1600-016-A", "lot", 478529543.54, 1, 1, 0, "Multi-Purpose Arena (MPA)"],
    [1223, "215", "Other Structures", "Rehabilitation and Upgrading of Philsports Arena (Contiguous Works) located at Meralco, Avenue, Pasig City, BAC Res. No. INFRA 123a - 2019, BR No. 172", "PSC-1600-016-A", "lot", 60361382.17, 1, 1, 0, "Multi-Purpose Arena (MPA)"],
    [1224, "215", "Other Structures", "Office of the First Lady Renovation", "PSC-1600-019-A", "lot", 0.0, 1, 1, 0, "PSC Gym (Formerly Brent Gym)"],
    [1225, "215", "Other Structures", "Full Payment for the Project Rehabilitation of Athletes Quarters and Other Various Works at Amoranto Stadium, Quezon City (Check No. 428998 dtd.10/23/", "PSC-1103-001-A", "lot", 7861746.0, 1, 1, 0, "Amoranto Velodrome, Quezon City"],
    [1226, "215", "Other Structures", "Construction of Archery Range in UP Diliman, QC", "PSC-1101-001-A", "lot", 11917573.99, 1, 1, 0, "UP Diliman, Quezon City"],
    [1227, "215", "Other Structures", "Construction of Evelio Javier Sports Complex, Province of Antique.", "PSC-5700-001-A", "lot", 3860461.63, 1, 1, 0, "Province of Antique"],
    [1228, "215", "Other Structures", "Construction of Evelio Javier Sports Complex, Province of Antique", "PSC-5700-001-A", "lot", 34745928.18, 1, 1, 0, "Province of Antique"],
    [1229, "215", "Other Structures", "Transfer: Proposed Upgrading of Biniyaran Sports Complex in Antique / Adj: JV #22128 - Consultancy Services for the Construction of Binirayan Sports C", "PSC-5700-001-A", "lot", 2130136.25, 1, 1, 0, "Province of Antique"],
    [1230, "215", "Other Structures", "Repair / Renovation of Variuos Facilities at Training Camp, Baguio City", "PSC-2600-000-A", "lot", 1505771.42, 1, 1, 0, "PSC- Baguio Training Camp"],
    [1231, "215", "Other Structures", "Supply of Labor and Materials for the Riprapping Works in Front of the Boxing Gym at the PSC-Baguio Training Camp", "PSC-2600-000-A", "lot", 735500.0, 1, 1, 0, "PSC- Baguio Training Camp"],
    [1232, "215", "Other Structures", "Payment for the Construction of Grouted Riprap for PSC Baguio Teacher's Camp", "PSC-2600-000-A", "lot", 276999.0, 1, 1, 0, "PSC- Baguio Training Camp"],
    [1233, "215", "Other Structures", "Repair / Renovation of Athletes Mess Hall at Teacher's Camp, Baguio City", "PSC-2600-001-A", "lot", 2377874.77, 1, 1, 0, "Mess Hall / Admin Office"],
    [1234, "215", "Other Structures", "Extra Work Order / Variation Order #01 Baguio Athletes Mess Hall", "PSC-2600-001-A", "lot", 316966.72, 1, 1, 0, "Mess Hall / Admin Office"],
    [1235, "215", "Other Structures", "Variation Order at Teacher's Camp, Baguio City for the Weightlifting Demolition and Repair of Boxing Gym", "PSC-2600-002-A", "lot", 44584.83, 1, 1, 0, "Boxing Gym/ Multi-purpose Gym"],
    [1236, "215", "Other Structures", "Rehabilitation of 3 Cottages at PSC Training Camp, Baguio City", "PSC-2600-004-A", "lot", 2306963.58, 1, 1, 0, "Cottage 304"],
    [1237, "215", "Other Structures", "Restoration of Barrows Hall at PSC-Training Camp, Baguio City.", "PSC-2600-007-A", "lot", 946500.0, 1, 1, 0, "Barrows Hall and Athletes Quarter"],
    [1238, "215", "Other Structures", "Repair/Renovation and Upgrading of Athletes Cottages, Teachers Camp, Baguio City (Supplemental)", "PSC-2600-007-A", "lot", 569830.85, 1, 1, 0, "Barrows Hall and Athletes Quarter"],
    [1239, "215", "Other Structures", "Restoration of Barrows Hall", "PSC-2600-007-A", "lot", 3000000.0, 1, 1, 0, "Barrows Hall and Athletes Quarter"],
    [1240, "215", "Other Structures", "Supplemental Contract for the Restoration of Barrows Hall", "PSC-2600-007-A", "lot", 1993000.0, 1, 1, 0, "Barrows Hall and Athletes Quarter"],
    [1241, "215", "Other Structures", "Payment for Final Billing of the Renovation and Upgrading of Baguio Track Oval", "PSC-2600-010-A", "lot", 8954162.4, 1, 1, 0, "Track Oval Mini"],
    [1242, "215", "Other Structures", "Transfer to Asset Account Various Completed Projects Full Payment of Construction Design, Supply and Installation of Machine Roomless Elevator", "4", "lot", 2745058.53, 1, 1, 0, "Project with No Specified Location (NSDF)"],
    [1243, "215", "Other Structures", "Property Warehouse", "PSC-1004-005-A", "lot", 2986444.0, 1, 1, 0, "RM Property Office"]
];

const ALL_DATA = RAW.map(function (r) {
    return {
        id: r[0], ac: r[1], article: r[2], desc: r[3],
        propNo: r[4], uom: r[5], uv: r[6], qc: r[7], qp: r[8], sh: r[9], loc: r[10],
        category: ACC_MAP[r[1]] || "Unclassified",
        totalVal: r[6] * (r[8] || 1),
    };
});

const UNIQUE_ARTICLES = ["All"].concat(
    Array.from(new Set(ALL_DATA.map(function (r) { return r.article; }))).sort()
);
const UNIQUE_CATS = ["All"].concat(
    Object.values(ACC_MAP).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort()
);
const UNIQUE_ACC = ["All"].concat(Object.keys(ACC_MAP).filter(function (k) { return k !== ""; }));

const PAGE_SIZES = [25, 50, 100, 200];

function fmt(n) {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 2 }).format(n);
}
function fmtNum(n) {
    return new Intl.NumberFormat("en-PH").format(n);
}

// ─── Add Asset Modal ─────────────────────────────────────────────────────────
var EMPTY_FORM = {
    ac: "", article: "", desc: "", propNo: "", uom: "unit",
    uv: "", qc: "1", qp: "1", sh: "0", loc: "",
};

function AddAssetModal({ open, onClose, onSave }) {
    var [form, setForm] = useState(EMPTY_FORM);
    var [errors, setErrors] = useState({});
    var [saving, setSaving] = useState(false);

    function handleChange(field, value) {
        setForm(function (prev) {
            var next = Object.assign({}, prev);
            next[field] = value;
            return next;
        });
        if (errors[field]) {
            setErrors(function (prev) {
                var next = Object.assign({}, prev);
                delete next[field];
                return next;
            });
        }
    }

    function validate() {
        var errs = {};
        if (!form.ac) errs.ac = "Account code is required.";
        if (!form.article) errs.article = "Article is required.";
        if (!form.propNo) errs.propNo = "Property number is required.";
        if (!form.uom) errs.uom = "Unit of measure is required.";
        if (form.uv === "" || isNaN(parseFloat(form.uv)) || parseFloat(form.uv) < 0)
            errs.uv = "Enter a valid unit value (0 or more).";
        if (!form.qc || isNaN(parseInt(form.qc, 10)) || parseInt(form.qc, 10) < 0)
            errs.qc = "Enter a valid quantity.";
        if (!form.qp || isNaN(parseInt(form.qp, 10)) || parseInt(form.qp, 10) < 0)
            errs.qp = "Enter a valid quantity.";
        if (!form.loc) errs.loc = "Location / remarks is required.";
        return errs;
    }

    function handleSave() {
        var errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setSaving(true);
        // Simulate async — replace setTimeout with your API call
        setTimeout(function () {
            var newRecord = {
                id: Date.now(),
                ac: form.ac,
                article: form.article,
                desc: form.desc,
                propNo: form.propNo,
                uom: form.uom,
                uv: parseFloat(form.uv) || 0,
                qc: parseInt(form.qc, 10) || 0,
                qp: parseInt(form.qp, 10) || 0,
                sh: parseInt(form.sh, 10) || 0,
                loc: form.loc,
                category: ACC_MAP[form.ac] || "Unclassified",
                totalVal: (parseFloat(form.uv) || 0) * (parseInt(form.qp, 10) || 1),
            };
            setSaving(false);
            setForm(EMPTY_FORM);
            setErrors({});
            onSave(newRecord);
            onClose();
        }, 600);
    }

    function handleClose() {
        setForm(EMPTY_FORM);
        setErrors({});
        onClose();
    }

    var acColor = ACC_COLOR[form.ac] || "secondary";

    return (
        <Modal isOpen={open} size="lg" centered scrollable toggle={handleClose}>
            <ModalHeader toggle={handleClose} className="border-bottom-0 pb-0">
                <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary-subtle rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 38, height: 38 }}>
                        <i className="ri-add-circle-line text-primary fs-4"></i>
                    </div>
                    <div>
                        <p className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>Add New Asset</p>
                        <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>Fill in the property details below</p>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="pt-2 px-4">

                {/* Classification */}
                <div className="mb-3 pb-1 border-bottom">
                    <p className="text-uppercase fw-semibold text-muted mb-0" style={{ fontSize: "0.68rem", letterSpacing: "0.07em" }}>
                        <i className="ri-folder-3-line me-1"></i>Classification
                    </p>
                </div>
                <Row className="g-3 mb-3">
                    <Col md={6}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Account Code <span className="text-danger">*</span>
                            </Label>
                            <select
                                className={"form-select form-select-sm" + (errors.ac ? " is-invalid" : "")}
                                value={form.ac}
                                onChange={function (e) { handleChange("ac", e.target.value); }}
                            >
                                <option value="">— Select Account Code —</option>
                                {Object.keys(ACC_MAP).filter(function (k) { return k !== ""; }).map(function (k) {
                                    return <option key={k} value={k}>{k} — {ACC_MAP[k]}</option>;
                                })}
                            </select>
                            {errors.ac && <div className="invalid-feedback d-block">{errors.ac}</div>}
                            {form.ac && (
                                <div className="mt-1">
                                    <Badge color={acColor} className="rounded-pill" style={{ fontSize: "0.7rem" }}>
                                        {ACC_MAP[form.ac]}
                                    </Badge>
                                </div>
                            )}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Article / Asset Type <span className="text-danger">*</span>
                            </Label>
                            <Input
                                bsSize="sm"
                                placeholder="e.g. Laptop Computer, Airconditioner"
                                value={form.article}
                                invalid={!!errors.article}
                                onChange={function (e) { handleChange("article", e.target.value); }}
                            />
                            <FormFeedback>{errors.article}</FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>

                {/* Description & Identity */}
                <div className="mb-3 pb-1 border-bottom">
                    <p className="text-uppercase fw-semibold text-muted mb-0" style={{ fontSize: "0.68rem", letterSpacing: "0.07em" }}>
                        <i className="ri-file-text-line me-1"></i>Description &amp; Identity
                    </p>
                </div>
                <Row className="g-3 mb-3">
                    <Col md={12}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>Full Description</Label>
                            <Input
                                type="textarea"
                                rows={3}
                                bsSize="sm"
                                placeholder="Brand, model, serial number, specifications..."
                                value={form.desc}
                                onChange={function (e) { handleChange("desc", e.target.value); }}
                                style={{ resize: "vertical", fontSize: "0.82rem" }}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Property Number <span className="text-danger">*</span>
                            </Label>
                            <Input
                                bsSize="sm"
                                placeholder="e.g. 2025-I-3-1866"
                                value={form.propNo}
                                invalid={!!errors.propNo}
                                onChange={function (e) { handleChange("propNo", e.target.value); }}
                                style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
                            />
                            <FormFeedback>{errors.propNo}</FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Unit of Measure <span className="text-danger">*</span>
                            </Label>
                            <select
                                className={"form-select form-select-sm" + (errors.uom ? " is-invalid" : "")}
                                value={form.uom}
                                onChange={function (e) { handleChange("uom", e.target.value); }}
                            >
                                {["unit", "set", "lot", "pair", "pc", "roll", "sets"].map(function (u) {
                                    return <option key={u} value={u}>{u}</option>;
                                })}
                            </select>
                            {errors.uom && <div className="invalid-feedback d-block">{errors.uom}</div>}
                        </FormGroup>
                    </Col>
                </Row>

                {/* Valuation & Quantities */}
                <div className="mb-3 pb-1 border-bottom">
                    <p className="text-uppercase fw-semibold text-muted mb-0" style={{ fontSize: "0.68rem", letterSpacing: "0.07em" }}>
                        <i className="bx bx-money me-1"></i>Valuation &amp; Quantities
                    </p>
                </div>
                <Row className="g-3 mb-3">
                    <Col md={4}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Unit Value (&#8369;) <span className="text-danger">*</span>
                            </Label>
                            <Input
                                bsSize="sm"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={form.uv}
                                invalid={!!errors.uv}
                                onChange={function (e) { handleChange("uv", e.target.value); }}
                            />
                            <FormFeedback>{errors.uv}</FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Qty per Property Card <span className="text-danger">*</span>
                            </Label>
                            <Input
                                bsSize="sm"
                                type="number"
                                min="0"
                                placeholder="1"
                                value={form.qc}
                                invalid={!!errors.qc}
                                onChange={function (e) { handleChange("qc", e.target.value); }}
                            />
                            <FormFeedback>{errors.qc}</FormFeedback>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Qty per Physical Count <span className="text-danger">*</span>
                            </Label>
                            <Input
                                bsSize="sm"
                                type="number"
                                min="0"
                                placeholder="1"
                                value={form.qp}
                                invalid={!!errors.qp}
                                onChange={function (e) { handleChange("qp", e.target.value); }}
                            />
                            <FormFeedback>{errors.qp}</FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>

                {/* Live total value preview */}
                {form.uv && form.qp && !isNaN(parseFloat(form.uv)) && !isNaN(parseInt(form.qp, 10)) && (
                    <div className="p-2 rounded-3 bg-success-subtle border border-success border-opacity-25 mb-3 d-flex align-items-center justify-content-between">
                        <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                            <i className="ri-calculator-line me-1 text-success"></i>
                            Total Value Preview (Unit Value &times; Physical Qty)
                        </span>
                        <span className="fw-bold text-success" style={{ fontSize: "0.9rem" }}>
                            {fmt(parseFloat(form.uv) * parseInt(form.qp, 10))}
                        </span>
                    </div>
                )}

                {/* Location & Remarks */}
                <div className="mb-3 pb-1 border-bottom">
                    <p className="text-uppercase fw-semibold text-muted mb-0" style={{ fontSize: "0.68rem", letterSpacing: "0.07em" }}>
                        <i className="ri-map-pin-line me-1"></i>Location &amp; Remarks
                    </p>
                </div>
                <Row className="g-3">
                    <Col md={12}>
                        <FormGroup className="mb-0">
                            <Label className="fw-semibold" style={{ fontSize: "0.82rem" }}>
                                Location / Remarks <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="textarea"
                                rows={2}
                                bsSize="sm"
                                placeholder="e.g. RMSC-Admin BLDG. 3rd Floor Room 302 (ISU Office)"
                                value={form.loc}
                                invalid={!!errors.loc}
                                onChange={function (e) { handleChange("loc", e.target.value); }}
                                style={{ resize: "vertical", fontSize: "0.82rem" }}
                            />
                            <FormFeedback>{errors.loc}</FormFeedback>
                        </FormGroup>
                    </Col>
                </Row>

            </ModalBody>
            <ModalFooter className="border-top-0 pt-0 gap-2">
                <div className="me-auto">
                    <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                        <span className="text-danger">*</span> Required fields
                    </p>
                </div>
                <Button color="light" onClick={handleClose} disabled={saving}>
                    <i className="ri-close-line me-1"></i>Cancel
                </Button>
                <Button color="primary" onClick={handleSave} disabled={saving}>
                    {saving
                        ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving&#8230;</>
                        : <><i className="ri-save-line me-1"></i>Save Asset</>
                    }
                </Button>
            </ModalFooter>
        </Modal>
    );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
    if (!item) return null;
    var color = ACC_COLOR[item.ac] || "secondary";
    return (
        <Modal isOpen size="lg" centered scrollable toggle={onClose}>
            <ModalHeader toggle={onClose} className="border-bottom-0 pb-0">
                <div className="d-flex align-items-center gap-2">
                    <div
                        className={"bg-" + color + "-subtle rounded-2 d-flex align-items-center justify-content-center"}
                        style={{ width: 38, height: 38 }}
                    >
                        <i className={"ri-archive-drawer-line text-" + color + " fs-4"}></i>
                    </div>
                    <div>
                        <p className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>{item.article}</p>
                        <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>Asset ID #{item.id}</p>
                    </div>
                </div>
            </ModalHeader>
            <ModalBody className="pt-2">
                <div className="p-3 rounded-3 bg-light bg-opacity-50 border mb-3">
                    <p className="mb-0 fw-semibold" style={{ fontSize: "0.82rem" }}>{item.desc || "—"}</p>
                </div>
                <div className="row g-2">
                    {[
                        ["Property No.", item.propNo || "—"],
                        ["Account Code", item.ac ? item.ac + " — " + item.category : "—"],
                        ["Article", item.article],
                        ["Unit of Measure", item.uom || "—"],
                        ["Unit Value", fmt(item.uv)],
                        ["Qty per Property Card", fmtNum(item.qc)],
                        ["Qty per Physical Count", fmtNum(item.qp)],
                        ["Location / Remarks", item.loc || "—"],
                    ].map(function (row) {
                        return (
                            <div key={row[0]} className="col-sm-6">
                                <div className="d-flex flex-column p-2 rounded-3 border h-100">
                                    <p className="mb-0 text-muted" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        {row[0]}
                                    </p>
                                    <p className="mb-0 fw-semibold mt-1" style={{ fontSize: "0.83rem" }}>{row[1]}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div className="col-sm-6">
                        <div className="d-flex flex-column p-2 rounded-3 border h-100">
                            <p className="mb-0 text-muted" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Shortage / Overage</p>
                            <p className="mb-0 mt-1">
                                {item.sh !== 0
                                    ? <Badge color="danger">{item.sh}</Badge>
                                    : <Badge color="success">None</Badge>
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-3 p-2 rounded-3 border d-flex align-items-center justify-content-between">
                    <span className="text-muted" style={{ fontSize: "0.78rem" }}>Total Value (Unit Value × Physical Count)</span>
                    <span className="fw-bold text-success" style={{ fontSize: "1rem" }}>{fmt(item.totalVal)}</span>
                </div>
            </ModalBody>
        </Modal>
    );
}

export default function AssetMasterlist() {
    var [search, setSearch] = useState("");
    var [filterCat, setFilterCat] = useState("All");
    var [filterArt, setFilterArt] = useState("All");
    var [filterAcc, setFilterAcc] = useState("All");
    var [filterSh, setFilterSh] = useState(false);
    var [sortCol, setSortCol] = useState("id");
    var [sortDir, setSortDir] = useState("asc");
    var [page, setPage] = useState(1);
    var [pageSize, setPageSize] = useState(50);
    var [selected, setSelected] = useState(null);
    var [addOpen, setAddOpen] = useState(false);
    var [localData, setLocalData] = useState(ALL_DATA);

    function handleAddSave(newRecord) {
        setLocalData(function (prev) { return [newRecord].concat(prev); });
    }

    var filtered = useMemo(function () {
        var d = localData;
        if (filterCat !== "All") d = d.filter(function (r) { return r.category === filterCat; });
        if (filterAcc !== "All") d = d.filter(function (r) { return r.ac === filterAcc; });
        if (filterArt !== "All") d = d.filter(function (r) { return r.article === filterArt; });
        if (filterSh) d = d.filter(function (r) { return r.sh !== 0; });
        if (search.trim()) {
            var q = search.toLowerCase();
            d = d.filter(function (r) {
                return r.article.toLowerCase().includes(q)
                    || r.desc.toLowerCase().includes(q)
                    || r.propNo.toLowerCase().includes(q)
                    || r.loc.toLowerCase().includes(q);
            });
        }
        return d.slice().sort(function (a, b) {
            var va = a[sortCol], vb = b[sortCol];
            if (typeof va === "string") va = va.toLowerCase();
            if (typeof vb === "string") vb = vb.toLowerCase();
            return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
        });
    }, [localData, search, filterCat, filterAcc, filterArt, filterSh, sortCol, sortDir]);

    var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    var pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
    var totalValue = useMemo(function () { return filtered.reduce(function (s, r) { return s + r.totalVal; }, 0); }, [filtered]);
    var totalQty = useMemo(function () { return filtered.reduce(function (s, r) { return s + (r.qp || 0); }, 0); }, [filtered]);

    var handleSort = useCallback(function (col) {
        if (sortCol === col) setSortDir(function (d) { return d === "asc" ? "desc" : "asc"; });
        else { setSortCol(col); setSortDir("asc"); }
        setPage(1);
    }, [sortCol]);

    var pageBtns = useMemo(function () {
        var btns = [], delta = 2;
        for (var i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) btns.push(i);
            else if (btns[btns.length - 1] !== "...") btns.push("...");
        }
        return btns;
    }, [page, totalPages]);

    var hasFilters = search || filterCat !== "All" || filterAcc !== "All" || filterArt !== "All" || filterSh;

    function SortIcon({ col }) {
        if (sortCol !== col) return <i className="ri-arrow-up-down-line ms-1 opacity-25"></i>;
        return sortDir === "asc"
            ? <i className="ri-arrow-up-line ms-1 text-primary"></i>
            : <i className="ri-arrow-down-line ms-1 text-primary"></i>;
    }

    function resetFilters() {
        setSearch(""); setFilterCat("All"); setFilterAcc("All");
        setFilterArt("All"); setFilterSh(false); setPage(1);
    }

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Asset Registry" crumbs={[
                    { title: "FMS", url: "/fms/dashboard" },
                ]} />

                {/* Summary Strip */}
                <Row className="g-3 mb-4">
                    {[
                        { label: "Total Records", value: fmtNum(localData.length), icon: "ri-list-check-3", color: "primary" },
                        { label: "Total Items", value: fmtNum(localData.reduce(function (s, r) { return s + r.qp; }, 0)), icon: "ri-stack-line", color: "info" },
                        { label: "Total Asset Value", value: "5.63B", icon: "bx bx-money", icon: "ri-stack-line", color: "success" },
                        { label: "With Shortage", value: fmtNum(localData.filter(function (r) { return r.sh !== 0; }).length), icon: "ri-alert-line", color: "danger" },
                    ].map(function (s) {
                        return (
                            <Col key={s.label} xl={3}>
                                <Card className="card-animate border-0 shadow-sm mb-0">
                                    <CardBody className="p-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <p className="text-uppercase fw-semibold text-muted mb-1" style={{ fontSize: "0.67rem", letterSpacing: "0.07em" }}>{s.label}</p>
                                                <h4 className="mb-0 fw-bold ff-secondary">{s.value}</h4>
                                            </div>
                                            <div className={"bg-" + s.color + "-subtle rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"} style={{ width: 44, height: 44 }}>
                                                <i className={s.icon + " text-" + s.color + " fs-3"}></i>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>

                {/* Filters Card */}
                <Card className="border-0 shadow-sm mb-4">
                    <CardHeader className="border-bottom-0 pt-3 pb-2 px-4">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div>
                                <h5 className="card-title mb-0">
                                    <i className="ri-file-list-3-line me-2 text-primary"></i>
                                    Asset Masterlist — Report on Physical Count of PPE
                                </h5>
                                <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.78rem" }}>
                                    As of December 31, 2025 &nbsp;&middot;&nbsp; Philippine Sports Commission &nbsp;&middot;&nbsp; 1,243 property records
                                </p>
                            </div>
                            <div className="d-flex gap-2 flex-wrap align-items-center">
                                {hasFilters && (
                                    <Button size="sm" color="light" onClick={resetFilters}>
                                        <i className="ri-refresh-line me-1"></i>Clear Filters
                                    </Button>
                                )}
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: 80 }}
                                    value={pageSize}
                                    onChange={function (e) { setPageSize(+e.target.value); setPage(1); }}
                                >
                                    {PAGE_SIZES.map(function (n) { return <option key={n} value={n}>{n}</option>; })}
                                </select>
                                <Button color="primary" size="sm" onClick={function () { setAddOpen(true); }}>
                                    <i className="ri-add-line me-1"></i>Add New Asset
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="px-4 pt-2 pb-3">
                        <Row className="g-2">
                            <Col lg={4}>
                                <div className="search-box">
                                    <Input
                                        className="search"
                                        placeholder="Search article, description, property no., location…"
                                        value={search}
                                        onChange={function (e) { setSearch(e.target.value); setPage(1); }}
                                        style={{ fontSize: "0.82rem" }}
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                            </Col>
                            <Col lg={2} sm={6}>
                                <select
                                    className="form-select form-select-sm"
                                    value={filterAcc}
                                    onChange={function (e) { setFilterAcc(e.target.value); setFilterCat("All"); setPage(1); }}
                                >
                                    <option value="All">All Account Codes</option>
                                    {UNIQUE_ACC.filter(function (k) { return k !== "All"; }).map(function (k) {
                                        return <option key={k} value={k}>{k} — {ACC_MAP[k]}</option>;
                                    })}
                                </select>
                            </Col>
                            <Col lg={2} sm={6}>
                                <select
                                    className="form-select form-select-sm"
                                    value={filterCat}
                                    onChange={function (e) { setFilterCat(e.target.value); setFilterAcc("All"); setPage(1); }}
                                >
                                    {UNIQUE_CATS.map(function (c) { return <option key={c} value={c}>{c}</option>; })}
                                </select>
                            </Col>
                            <Col lg={2} sm={6}>
                                <select
                                    className="form-select form-select-sm"
                                    value={filterArt}
                                    onChange={function (e) { setFilterArt(e.target.value); setPage(1); }}
                                >
                                    {UNIQUE_ARTICLES.map(function (a) { return <option key={a} value={a}>{a}</option>; })}
                                </select>
                            </Col>
                            <Col lg={2} sm={6}>
                                <div className="d-flex align-items-center gap-2 h-100">
                                    <div className="form-check form-switch mb-0">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="shortageSwitch"
                                            checked={filterSh}
                                            onChange={function (e) { setFilterSh(e.target.checked); setPage(1); }}
                                        />
                                        <label className="form-check-label" htmlFor="shortageSwitch" style={{ fontSize: "0.82rem" }}>
                                            Shortage Only
                                        </label>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {hasFilters && (
                            <div className="d-flex flex-wrap gap-1 mt-2">
                                {search && <Badge color="primary" className="rounded-pill fw-normal" style={{ fontSize: "0.72rem" }}>
                                    <i className="ri-search-line me-1"></i>&ldquo;{search}&rdquo;
                                </Badge>}
                                {filterCat !== "All" && <Badge color="info" className="rounded-pill fw-normal" style={{ fontSize: "0.72rem" }}>
                                    Category: {filterCat}
                                </Badge>}
                                {filterAcc !== "All" && <Badge color="warning" className="rounded-pill fw-normal" style={{ fontSize: "0.72rem" }}>
                                    Acct: {filterAcc} — {ACC_MAP[filterAcc]}
                                </Badge>}
                                {filterArt !== "All" && <Badge color="success" className="rounded-pill fw-normal" style={{ fontSize: "0.72rem" }}>
                                    Article: {filterArt}
                                </Badge>}
                                {filterSh && <Badge color="danger" className="rounded-pill fw-normal" style={{ fontSize: "0.72rem" }}>
                                    Shortage Only
                                </Badge>}
                                <span className="text-muted" style={{ fontSize: "0.72rem", alignSelf: "center" }}>
                                    — {fmtNum(filtered.length)} result{filtered.length !== 1 ? "s" : ""} &nbsp;&middot;&nbsp; {fmt(totalValue)} total
                                </span>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm mb-4">
                    <CardBody className="p-0">
                        {filtered.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <i className="ri-inbox-line d-block fs-1 mb-2 opacity-25"></i>
                                <p className="fw-medium mb-1">No records found.</p>
                                <Button size="sm" color="link" onClick={resetFilters}>Clear all filters</Button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table className="table-hover table-nowrap align-middle mb-0" style={{ fontSize: "0.8rem" }}>
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: 46, fontSize: "0.68rem" }}>No.</th>
                                            <th style={{ cursor: "pointer", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                                onClick={function () { handleSort("ac"); }}>
                                                Acct. Code <SortIcon col="ac" />
                                            </th>
                                            <th style={{ cursor: "pointer", minWidth: 130, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                                onClick={function () { handleSort("article"); }}>
                                                Article <SortIcon col="article" />
                                            </th>
                                            <th style={{ minWidth: 260, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</th>
                                            <th style={{ cursor: "pointer", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                                onClick={function () { handleSort("propNo"); }}>
                                                Property No. <SortIcon col="propNo" />
                                            </th>
                                            <th style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>UOM</th>
                                            <th style={{ cursor: "pointer", textAlign: "right", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
                                                onClick={function () { handleSort("uv"); }}>
                                                Unit Value <SortIcon col="uv" />
                                            </th>
                                            <th style={{ textAlign: "center", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Qty Card</th>
                                            <th style={{ textAlign: "center", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Qty Physical</th>
                                            <th style={{ textAlign: "center", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Shortage</th>
                                            <th style={{ minWidth: 200, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Location / Remarks</th>
                                            <th style={{ width: 60, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageData.map(function (r, idx) {
                                            var rowNum = (page - 1) * pageSize + idx + 1;
                                            var hasShortage = r.sh !== 0;
                                            return (
                                                <tr key={r.id} className={hasShortage ? "table-danger bg-opacity-10" : ""}>
                                                    <td className="text-muted" style={{ fontSize: "0.72rem" }}>{rowNum}</td>
                                                    <td>
                                                        <Badge color={ACC_COLOR[r.ac] || "secondary"} className="rounded-pill" style={{ fontSize: "0.68rem" }}>
                                                            {r.ac || "—"}
                                                        </Badge>
                                                        <div className="text-muted mt-1" style={{ fontSize: "0.65rem", lineHeight: 1.2 }}>{r.category}</div>
                                                    </td>
                                                    <td>
                                                        <span className="fw-semibold" style={{ fontSize: "0.8rem" }}>{r.article}</span>
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-truncate" style={{ maxWidth: 280, fontSize: "0.78rem" }} title={r.desc}>
                                                            {r.desc || "—"}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <code className="text-primary" style={{ fontSize: "0.75rem" }}>{r.propNo || "—"}</code>
                                                    </td>
                                                    <td className="text-muted" style={{ fontSize: "0.78rem" }}>{r.uom}</td>
                                                    <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                                        <span className="fw-semibold">{r.uv > 0 ? fmt(r.uv) : "—"}</span>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>{fmtNum(r.qc)}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <Badge color={r.qp > 0 ? "success" : "secondary"} className="rounded-pill" style={{ fontSize: "0.72rem" }}>
                                                            {fmtNum(r.qp)}
                                                        </Badge>
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {hasShortage
                                                            ? <Badge color="danger" className="rounded-pill" style={{ fontSize: "0.72rem" }}>{r.sh}</Badge>
                                                            : <span className="text-muted" style={{ fontSize: "0.72rem" }}>—</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        <p className="mb-0 text-truncate text-muted" style={{ maxWidth: 220, fontSize: "0.75rem" }} title={r.loc}>
                                                            {r.loc || "—"}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-soft-primary p-1 lh-1"
                                                            title="View Details"
                                                            onClick={function () { setSelected(r); }}
                                                        >
                                                            <i className="ri-eye-line fs-6"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="table-light">
                                        <tr>
                                            <td colSpan={6} className="fw-bold text-end pe-3" style={{ fontSize: "0.78rem" }}>
                                                Totals (filtered {fmtNum(filtered.length)} records):
                                            </td>
                                            <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                                                <span className="fw-bold text-success" style={{ fontSize: "0.82rem" }}>{fmt(totalValue)}</span>
                                            </td>
                                            <td style={{ textAlign: "center", fontWeight: 600 }}>
                                                {fmtNum(filtered.reduce(function (s, r) { return s + r.qc; }, 0))}
                                            </td>
                                            <td style={{ textAlign: "center", fontWeight: 600 }}>{fmtNum(totalQty)}</td>
                                            <td colSpan={3}></td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Pagination */}
                {filtered.length > 0 && (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                        <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                            Showing {fmtNum((page - 1) * pageSize + 1)}&ndash;{fmtNum(Math.min(page * pageSize, filtered.length))} of {fmtNum(filtered.length)} records
                        </p>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={"page-item " + (page === 1 ? "disabled" : "")}>
                                <button className="page-link" onClick={function () { setPage(function (p) { return Math.max(1, p - 1); }); }}>
                                    <i className="ri-arrow-left-s-line"></i>
                                </button>
                            </li>
                            {pageBtns.map(function (b, i) {
                                return (
                                    <li key={i} className={"page-item " + (b === page ? "active" : "") + " " + (b === "..." ? "disabled" : "")}>
                                        <button className="page-link" onClick={function () { if (b !== "...") setPage(b); }}>{b}</button>
                                    </li>
                                );
                            })}
                            <li className={"page-item " + (page === totalPages ? "disabled" : "")}>
                                <button className="page-link" onClick={function () { setPage(function (p) { return Math.min(totalPages, p + 1); }); }}>
                                    <i className="ri-arrow-right-s-line"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                )}

                {/* Detail Modal */}
                <DetailModal item={selected} onClose={function () { setSelected(null); }} />

                {/* Add Asset Modal */}
                <AddAssetModal
                    open={addOpen}
                    onClose={function () { setAddOpen(false); }}
                    onSave={handleAddSave}
                />
            </Container>
        </div>
    );
}