/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "profilePicture", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "URL of the user's profile picture",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "profilePicture")
  },
}
