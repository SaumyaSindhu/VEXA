Data Modeling --> the process of creating visual representations or blueprints, known as data models, that define how data is structured stored, and connected within an organization

User --> _id, username, email, password, verified, createdAt, updatedAt

Chat --> _id, user, title, createdAt, updatedAt

Message --> _id, chat, content, role:[user, AI]