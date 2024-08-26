import { HOLE_DATA_TABLE_NAME } from "~/constants/table";
import { db } from "~/database/db";
import type { HoleData } from "~/schemas/tournament/holesSchema";

class holeDataDAO {
  async getAll() {
    try {
      const results = await db
        .table(HOLE_DATA_TABLE_NAME)
        .select("*")
        .returning("*");

      return results;
    } catch (error) {
      throw error;
    }
  }

  async insert(holdData: HoleData, tournamentId: number) {
    try {
      const [hole_data_id] = await db
        .table(HOLE_DATA_TABLE_NAME)
        .insert({
          hole_id: holdData?.holeId,
          course_id: holdData?.courseId,
          tee_position: holdData?.teePosition,
          wind_direction: holdData?.windDirection,
          wind_speed: holdData.windSpeed,
          tournament_id: tournamentId,
        })
        .returning("hole_data_id");

      return hole_data_id;
    } catch (error) {
      throw error;
    }
  }
}

export default new holeDataDAO();
