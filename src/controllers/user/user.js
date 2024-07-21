const User = require('../../models/users');

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};
