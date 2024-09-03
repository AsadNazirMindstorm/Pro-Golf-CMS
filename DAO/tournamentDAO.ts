import { HOLE_DATA_TABLE_NAME, TOURNAMENT_TABLE_NAME } from "~/constants/table";
import { db } from "~/database/db";
import type { Tournament } from "~/schemas/tournamentSchema";
import holeDataDAO from "./holeDataDAO";

class tournamentDAO {
  async getAll(limit: number, offset: number, search: string) {
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
        t.is_random AS "holeData.isRandom",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        t.pushed_to_nakama AS "pushedToNakama",
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
      ON t.id = h.tournament_id
      WHERE (LOWER(t.title) LIKE LOWER('%${search}%'))
      GROUP BY t.tournament_id
      ORDER BY t.tournament_id DESC
      OFFSET ${offset}
      LIMIT ${limit}
    `);

      // Transform the raw results into the nested JSON format
      const res = results.rows.map((row: { [x: string]: any }) => ({
        metaData: {
          category: row["metaData.id"],
          title: row["metaData.title"],
          league: row["metaData.league"],
          icon: row["metaData.icon"],
        },
        availabiltyData: {
          startDateTime: new Date(
            parseInt(row["availabiltyData.startDateTime"])
          ).toISOString(),
          endDateTime: new Date(
            parseInt(row["availabiltyData.endDateTime"])
          ).toISOString(),
          totalTime: row["availabiltyData.totalTime"],
          userPlayTime: row["availabiltyData.userPlayTime"],
        },
        holeData: {
          isRandom: row["holeData.isRandom"],
          holeCount: row["holeData.holeCount"],
          holeData: row["holeData.holeData"],
        },
        createdAt: row["createdAt"],
        updatedAt: row["updatedAt"],
        pushedToNakama: row["pushedToNakama"],
      }));

      return res;
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }

  async getTournament(id: string) {
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
        t.is_random AS "holeData.isRandom",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        t.pushed_to_nakama AS "pushedToNakama",
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
      ON t.id = h.tournament_id
      WHERE t.id = '${id}'
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
          startDateTime: new Date(
            parseInt(row["availabiltyData.startDateTime"])
          ).toISOString(), //converting into iso time
          endDateTime: new Date(
            parseInt(row["availabiltyData.endDateTime"])
          ).toISOString(), // converting into iso time
          totalTime: row["availabiltyData.totalTime"],
          userPlayTime: row["availabiltyData.userPlayTime"],
        },
        holeData: {
          isRandom: row["holeData.isRandom"],
          holeCount: row["holeData.holeCount"],
          holeData: row["holeData.holeData"],
        },
        createdAt: row["createdAt"],
        updatedAt: row["updatedAt"],
      }));
    } catch (error: any) {
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
      const id = await this.insertTournament(tournament, false);
      return id;
    } catch (error: any) {
      //console.log(error);
      throw error;
    }
  }

  async insertTournament(tournament: Tournament, isEdit: boolean) {
    //putting tournament logic

    console.log("Created at is : ", tournament.createdAt);
    try {
      const startTime = tournament.availabiltyData.startDateTime;
      const endTime = tournament.availabiltyData.endDateTime;

      //convert into the epoc times
      const epocStartTime = new Date(startTime).getTime();
      const epocEndTime = new Date(endTime).getTime();

      const [{ id }] = await db
        .table(TOURNAMENT_TABLE_NAME)
        .insert({
          id: tournament.metaData.category, // UUID
          title: tournament.metaData.title,
          league: tournament.metaData.league,
          icon: tournament.metaData.icon,
          start_datetime: epocStartTime,
          end_datetime: epocEndTime,
          user_play_time: tournament.availabiltyData.userPlayTime,
          total_play_time: tournament.availabiltyData.totalTime,
          hole_count: tournament.holeData.holeCount,
          is_random: tournament.holeData.isRandom,
          pushed_to_nakama: tournament.pushedToNakama,
          created_at: isEdit ? tournament.createdAt : new Date().toISOString(), // if it is edit then it will use the created at date of prev tournamnet
          updated_at: isEdit ? new Date().toISOString() : null, // if it is edit then update the updated at date
        })
        .returning("id");

      tournament.holeData.holeData.forEach(async (element) => {
        try {
          await holeDataDAO.insert(element, id);
        } catch (error: any) {
          throw error;
        }
      });

      return id;
    } catch (error) {
      throw error;
    }
  }

  async getCount(search: string) {
    try {
      // Construct the search pattern
      const searchPattern = `%${search.toLowerCase()}%`;

      // Perform the count query
      const [result] = await db(TOURNAMENT_TABLE_NAME)
        .whereRaw("LOWER(title) LIKE ?", [searchPattern])
        .count("id as count");

      // Return the count as a number
      return parseInt(result.count, 10);
    } catch (error: any) {
      throw error;
    }
  }

  async updateStatus(id: string, status: boolean) {
    try {
      const res = await db
        .table(TOURNAMENT_TABLE_NAME)
        .where({ id }) // Filter the row(s) by ID
        .update({ pushed_to_nakama: status }); // Update the field

      return res;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new tournamentDAO();
