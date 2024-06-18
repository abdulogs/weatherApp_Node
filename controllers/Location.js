import Location from "../models/Location.js";

class LocationApi {
  static async listing(request, response) {
    try {
      const locations = await Location.findAll({
        where: {
          created_by: request.session.user_id ?? null,
        },
      });
      response.json(locations);
    } catch (error) {
      response.status(500).send(error);
    }
  }
  static async single(request, response) {
    const id = request.params.id;
    try {
      const location = await Location.findByPk(id);
      if (!location) {
        response.status(404).send({ msg: "Record not found!" });
      } else {
        response.json(location);
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }
  static async create(request, response) {
    const { name, is_active } = request.body;
    try {
      const data = await Location.create({
        name: name,
        is_active: is_active,
        created_by: request.session.user_id,
      });
      response.status(201).send(data);
    } catch (error) {
      response.status(500).send(error);
    }
  }
  static async update(request, response) {
    const id = request.params.id;
    const { name, is_active } = request.body;
    try {
      const location = await Location.findByPk(id);
      if (!location) {
        response.status(404).send({ msg: "Record not found!" });
      } else {
        let data = await location.update({ name, is_active });
        response.send(data);
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }
  static async destroy(request, response) {
    const id = request.params.id;
    try {
      const location = await Location.findByPk(id);
      if (!location) {
        response.status(404).send({ msg: "Record not found!" });
      } else {
        await location.destroy();
        response.send({ msg: "1 record deleted successfully" });
      }
    } catch (error) {
      response.status(500).send(error);
    }
  }
}

export default LocationApi;
