import csv
from sqlalchemy.orm import Session
from app.models import Inventory
from app.database import SessionLocal, engine, Base

def import_csv_to_db(csv_path: str):
    Base.metadata.create_all(bind=engine)  # create the table if not exists
    db: Session = SessionLocal()

    with open(csv_path, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            item = Inventory(
                product_name=row['product_name'],
                unit=row['unit'],
                price_per_unit=float(row['price_per_unit'])
            )
            db.add(item)
        db.commit()
        db.close()
        print("Inventory data inserted successfully.")

if __name__ == "__main__":
    import_csv_to_db("app/hardware_products.csv")
