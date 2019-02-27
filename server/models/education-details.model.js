module.exports = (sequelize, Sequelize) => {
	const Student = sequelize.define('education_detail', {
		roll_no: {
			type: Sequelize.STRING,
			primaryKey: true
		},
		certificate_degree_name: {
			type: Sequelize.STRING
		},
		major: {
			type: Sequelize.STRING
		},
		institute_university_name: {
			type: Sequelize.STRING
		},
		passing_year:{
			type:Sequelize.INTEGER
		},
		percentage: {
			type: Sequelize.FLOAT
		},
		cgpa: {
			type: Sequelize.FLOAT
		},
		proof_document: {
			type: Sequelize.BLOB('long')
		}

	}, {
			timestamps: false
		});

	return Student;
}