from fpdf import FPDF
import os

bills = [
    ("AHMAD RAHMAN", "001342138726", "18.06.2026", "220130103709"),
    ("SARAH LIM", "001342138727", "19.06.2026", "220130103710"),
    ("KUMAR RAJ", "001342138728", "20.06.2026", "220130103711"),
    ("AISHA HASSAN", "001342138729", "21.06.2026", "220130103712"),
    ("DANIEL TAN", "001342138730", "22.06.2026", "220130103713"),
    ("NURUL AMIN", "001342138731", "23.06.2026", "220130103714"),
    ("WONG MEI LING", "001342138732", "24.06.2026", "220130103715"),
    ("HAFIZ ABDULLAH", "001342138733", "25.06.2026", "220130103716"),
]

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

for name, invoice, date, account in bills:
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "Bil Elektrik Anda", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "ALAMAT POS", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, name, new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "NO. 12, JALAN TEKNOLOGI", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "TAMAN SAINS", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "59200 KUALA LUMPUR", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "WP KUALA LUMPUR", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, f"TARIKH BIL", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, date, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, f"NO. INVOIS", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, invoice, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, f"NO. AKAUN", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, account, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, f"TARIF", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, "Domestik Am", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.set_draw_color(200, 200, 200)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Ringkasan Bil Anda:", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 10)
    items = [
        ("Baki Terdahulu (RM)", "0.00"),
        ("Caj Semasa (RM)", "100.00"),
        ("Pelarasan Penggenapan", "0.00"),
    ]
    for desc, amt in items:
        pdf.cell(0, 6, f"{desc}  {amt}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, f"Jumlah Bil Anda (RM)  100.00", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, "Sila bayar sebelum", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 5, "16 Jul 2026", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(8)
    pdf.set_font("Helvetica", "I", 7)
    pdf.cell(0, 4, "Tenaga Nasional Berhad 199001009294 (200866-W)", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 4, "Aras 3, Tower D, TNB Platinum, No. 3, Jln Bkt Pantai, Bangsar, 59100 Kuala Lumpur.", align="C", new_x="LMARGIN", new_y="NEXT")

    filename = os.path.join(OUTPUT_DIR, f"{name.lower().replace(' ', '_')}.pdf")
    pdf.output(filename)
    print(f"Created: {filename}")

print("Done!")
