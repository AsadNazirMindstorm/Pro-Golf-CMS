import { TOURNAMENT_TABLE_NAME } from "~/constants/table";
import { db } from "~/database/db";
import type { Tournament } from "~/schemas/tournamentSchema";
import holeDataDAO from "./holeDataDAO";

class tournamentDAO {
  async getAll() {
    try {
      // Query to get tournament data with nested hole data
      const results = await db.raw(`
       SELECT
        t.id AS "metaData.id",
        t.title AS "metaData.title",
        t.league AS "metaData.league",
        t.icon AS "metaData.icon",
        t.start_datetime AS "availabiltyData.startDateTime",
        t.end_datetime AS "availabiltyData.endDateTime",
        t.total_play_time AS "availabiltyData.totalTime",
        t.user_play_time AS "availabiltyData.userPlayTime",
        t.hole_count AS "holeData.holeCount",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        json_agg(
          json_build_object(
            'courseId', h.course_id,
            'holeId', h.hole_id,
            'teePosition', h.tee_position,
            'windSpeed', h.wind_speed,
            'windDirection', h.wind_direction
          )
        ) AS "holeData.holeData"
      FROM tournament_table t
      LEFT JOIN hole_data_table h
      ON t.tournament_id = h.tournament_id
      GROUP BY t.tournament_id
    `);

      // Transform the raw results into the nested JSON format
      return results.rows.map((row: { [x: string]: any }) => ({
        metaData: {
          category: row["metaData.id"],
          title: row["metaData.title"],
          league: row["metaData.league"],
          icon: row["metaData.icon"],
        },
        availabiltyData: {
          startDateTime: row["availabiltyData.startDateTime"],
          endDateTime: row["availabiltyData.endDateTime"],
          totalTime: row["availabiltyData.totalTime"],
          userPlayTime: row["availabiltyData.userPlayTime"],
        },
        holeData: {
          holeCount: row["holeData.holeCount"],
          holeData: row["holeData.holeData"],
        },
        createdAt: row["createdAt"],
        updatedAt: row["updatedAt"],
      }));
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async deleteTournament(id: string) {
    try {
      console.log(id);
      const res = await db
        .table(TOURNAMENT_TABLE_NAME)
        .del()
        .where("id", "=", id); // deleting on the basis of UUID

      return res;
    } catch (error: any) {
      throw error;
    }
  }

  async createCopy(tournament: Tournament) {
    try {
      //create a new UUID for this
      tournament.metaData.category = crypto.randomUUID();

      //use the already defined function again to craete the copy
      const id = await this.insertTournament(tournament);
      return id;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async insertTournament(tournament: Tournament) {
    //putting tournament logic
    try {
      const [{ tournament_id }] = await db
        .table(TOURNAMENT_TABLE_NAME)
        .insert({
          id: tournament.metaData.category, // UUID
          title: tournament.metaData.title,
          league: tournament.metaData.league,
          icon: tournament.metaData.icon,
          start_datetime: tournament.availabiltyData.startDateTime,
          end_datetime: tournament.availabiltyData.endDateTime,
          user_play_time: tournament.availabiltyData.userPlayTime,
          total_play_time: tournament.availabiltyData.totalTime,
          hole_count: tournament.holeData.holeCount,
        })
        .returning("tournament_id");

      tournament.holeData.holeData.forEach(async (element) => {
        try {
          await holeDataDAO.insert(element, tournament_id);
        } catch (error: any) {
          throw error;
        }
      });

      return tournament_id;
    } catch (error) {
      throw error;
    }
  }
}

export default new tournamentDAO();
