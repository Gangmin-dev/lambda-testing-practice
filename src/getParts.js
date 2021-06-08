const mysql = require("serverless-mysql")({
  library: require("mysql2"),
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
});

module.exports.handler = async (event) => {
  if (!event.queryStringParameters.course_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "there is no matching queryString",
      }),
    };
  }

  return mysql
    .query(
      `
      SELECT chapter.id, chapter.number, chapter.title, part.id as partId, part.title as partTitle FROM chapter
      LEFT JOIN part ON part.chapter_id = chapter.id
      WHERE chapter.course_id = ?
      ORDER BY chapter.id
      `,
      [event.queryStringParameters.course_id]
    )
    .then((chaptersWithParts) => {
      if (chaptersWithParts.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "해당하는 과목 정보가 없습니다.",
          }),
        };
      }

      let chapters = [];
      let lastIndex;
      let currentChapterIndex;

      for (let i = 0; i < chaptersWithParts.length; i++) {
        if (
          i === 0 ||
          chaptersWithParts[lastIndex].id != chaptersWithParts[i].id
        ) {
          currentChapterIndex =
            chapters.push({
              id: chaptersWithParts[i].id,
              number: chaptersWithParts[i].number,
              title: chaptersWithParts[i].title,
              parts: [],
            }) - 1;
        }
        chapters[currentChapterIndex].parts.push({
          id: chaptersWithParts[i].partId,
          title: chaptersWithParts[i].partTitle,
        });
        lastIndex = i;
      }
      return {
        statusCode: 200,
        body: JSON.stringify(chapters),
      };
    })
    .finally(mysql.end());
};
