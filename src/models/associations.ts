import Todo from "./todo.model";
import User from "./user.modle";


/// For Creator
Todo.belongsTo(User, { foreignKey: "creator", as: "createdByUser" });

/// For Assigner
Todo.belongsTo(User, { foreignKey: "assigner", as: "assignedByUser" });

/// for Assignee
Todo.belongsTo(User, { foreignKey: "assignee", as: "assignToUser" });

// User.hasMany(Todo, { foreignKey: "creator", as: "createdTodos" });
// User.hasMany(Todo, { foreignKey: "assignee", as: "assignedTodos" });
// User.hasMany(Todo, { foreignKey: "assigner", as: "givenTodos" });

export { User, Todo };