
module.exports = async (client, oldMember, newMember) => {
  try {
    console.log(`${oldMember.user.username} updated their profile!`);
  } catch (error) {
    console.error('Failed to log Member update!', error)
  }
}