import { eq, ilike, and, or, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const searchTerm = searchParams.get("searchTerm")?.trim() || "";
    const selectedCity = searchParams.get("selectedCity");
    const selectedSpecialty = searchParams.get("selectedSpecialty");
    const itemsPerPage = 6;
    const offset = (page - 1) * itemsPerPage;
    const filters = [];

    if (searchTerm) {
      filters.push(
        or(
          ilike(advocates.firstName, `%${searchTerm}%`),
          ilike(advocates.lastName, `%${searchTerm}%`),
          ilike(advocates.city, `%${searchTerm}%`),
          sql`${advocates.specialties}::text ILIKE ${`%${searchTerm}%`}`
        )
      );
    }

    if (selectedCity && selectedCity !== "All") {
      filters.push(eq(advocates.city, selectedCity));
    }

    if (selectedSpecialty && selectedSpecialty !== "All") {
      filters.push(
        sql`${advocates.specialties}::text ILIKE ${`%${selectedSpecialty}%`}`
      );
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const data = await db
      .select()
      .from(advocates)
      .where(whereClause)
      .limit(itemsPerPage)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(advocates)
      .where(whereClause);

    return NextResponse.json({ data, total: count });
  } catch (err) {
    console.error("Error in /api/advocates GET:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
