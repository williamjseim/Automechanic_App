```json
{
  "openapi": "3.0.1",
  "info": {
    "title": "Mechanic.Api",
    "version": "1.0"
  },
  "paths": {
    "/cars/GetCars": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "startingIndex",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "amount",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "creatorName",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "make",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "model",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "plate",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "vin",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/GetCar": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "carId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/CarPages": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "amountPrPage",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "creatorName",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "make",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "model",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "plate",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "vin",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/IssuePages": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "amountPrPage",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "creatorName",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "make",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "plate",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "username",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "category",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/CreateCar": {
      "put": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "make",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "model",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "plate",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "vinnr",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "base64Image",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/DeleteIssue": {
      "delete": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "issueId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/DeleteCar": {
      "delete": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "carId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/GetIssue": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "issueId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/GetIssues": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "startingIndex",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          },
          {
            "name": "amount",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          },
          {
            "name": "creatorName",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "plate",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "make",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "category",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/CarIssues": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "carId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "startingIndex",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          },
          {
            "name": "amount",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/UserIssues": {
      "get": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "startingIndex",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          },
          {
            "name": "amount",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          },
          {
            "name": "userId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "make",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "model",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "plate",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          },
          {
            "name": "vin",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/CreateCarIssue": {
      "put": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "carId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "categoryId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "price",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "number",
              "format": "double"
            }
          },
          {
            "name": "coAuthorNames",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/UpdateCar": {
      "put": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "carId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "make",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "model",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "plate",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "vinnr",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/UpdateCarIssue": {
      "put": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "IssueId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "description",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "price",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "number",
              "format": "double"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/CreateCarIssueCategory": {
      "put": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "tag",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/CarIssueCategories": {
      "get": {
        "tags": [
          "Car"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/ChangeIssueStatus": {
      "put": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "issueId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/DeleteCarIssueCategory": {
      "delete": {
        "tags": [
          "Car"
        ],
        "parameters": [
          {
            "name": "categoryId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/cars/Debug fill database": {
      "put": {
        "tags": [
          "Car"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/Login": {
      "post": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "password",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/Register": {
      "post": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "email",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "password",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "role",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 0
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/DiscoverUser": {
      "get": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/GetUser": {
      "get": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "userId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/GetAllUsers": {
      "get": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "startingIndex",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "amount",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "username",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/UserPages": {
      "get": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "amountPrPage",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "username",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "default": ""
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/Delete": {
      "delete": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "userId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/IsAdmin": {
      "get": {
        "tags": [
          "User"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/decrypt": {
      "get": {
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "name": "encryptedtext",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/TestRegister": {
      "put": {
        "tags": [
          "User"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/User/Unauthorized": {
      "get": {
        "tags": [
          "User"
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/Video/Stream": {
      "get": {
        "tags": [
          "Video"
        ],
        "parameters": [
          {
            "name": "filePath",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/Video/StreamVideo": {
      "get": {
        "tags": [
          "Video"
        ],
        "parameters": [
          {
            "name": "videoId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/Video/GetVideoIssue": {
      "get": {
        "tags": [
          "Video"
        ],
        "parameters": [
          {
            "name": "issueId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/Video/Upload": {
      "put": {
        "tags": [
          "Video"
        ],
        "parameters": [
          {
            "name": "issueId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    },
    "/Video/Delete": {
      "delete": {
        "tags": [
          "Video"
        ],
        "parameters": [
          {
            "name": "videoId",
            "in": "query",
            "style": "form",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success"
          }
        }
      }
    }
  },
  "components": {

  }
}
```