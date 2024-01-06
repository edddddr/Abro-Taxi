module.exports={

    modelBookUpload: (sequelize, Sequelize) => {

	const Files = sequelize.define('files', {
        uploader_user_unique_id: {
			type: Sequelize.STRING(50)
	  },
	  mimeType: {
		type: Sequelize.STRING(50)
	  },
	  fileName: {
		type: Sequelize.STRING(50)
	  },
	  fileType: {
		type: Sequelize.STRING(50)
	  },
      fileDescription: {
		type: Sequelize.STRING(50)
      }
	});
	
	return Files;
},

modelBookRawQuery: (sequelize, Sequelize) => {

	const Files = sequelize.define('files', {
        uploader_user_unique_id: {
		type: Sequelize.STRING(50)
	  },
	  mimeType: {
		type: Sequelize.STRING
	  },
	  fileName: {
		type: Sequelize.STRING(100)
	  },
	  data: {
		type: Sequelize.BLOB('medium')
	  },
	  fileType: {
		type: Sequelize.STRING
	  }
	});
	
	return Files;
},

ModelBookInfoQuery: (sequelize, Sequelize) => {

	
	const Files = sequelize.define('files', {
        uploader_user_unique_id: {
		type: Sequelize.STRING(50)
	  },
	  mimeType: {
		type: Sequelize.STRING
	  },
	  fileName: {
		type: Sequelize.STRING(100)
	  },
	  fileType: {
		type: Sequelize.STRING
	  }
	});
	
	return Files;
},

modelFetchImgPost: (sequelize, Sequelize) => {

	const fetchImgs = sequelize.define('management_posts', {
        place: {
		type: Sequelize.STRING(50)
	  },
	  title: {
		type: Sequelize.STRING(50)
	  },
	  detail: {
		type: Sequelize.STRING(50)
	  },
	  img_Name: {
		type: Sequelize.STRING(50)
	  },
	  uploaded_by: {
		type: Sequelize.STRING(100)
	  }
	});
	
	return fetchImgs;
},

Modelprofile: (sequelize, Sequelize) => {

	const Image = sequelize.define('userinfotable',{
      phonNum: {
		type: Sequelize.STRING(50)
	  },
	  profImg: {
		type: Sequelize.BLOB('medium')
	  },
	  lightProfImage: {
		type: Sequelize.BLOB('tiny')  
	  }
	},{freezeTableName: true}
	);
	
	return Image;
},

modelFile: (sequelize, Sequelize) => {

	const Files = sequelize.define('files', {
        uploader_user_unique_id: {
		type: Sequelize.STRING(50)
	  },
	  mimeType: {
		type: Sequelize.STRING
	  },
	  fileName: {
		type: Sequelize.STRING(100)
	  },
	  data: {
		type: Sequelize.BLOB('medium')
	  },
	  fileType: {
		type: Sequelize.STRING
	  }
	});
	
	return Files;
}

}