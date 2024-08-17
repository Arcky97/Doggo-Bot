module.exports = async (client, member) => {
  try {
    console.log(`${member.user.username} updated their profile!`);
  } catch (error) {
    console.error('Failed to update Activity!')
  }
}