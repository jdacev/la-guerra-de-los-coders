package com.ga.robocode.rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.DatatypeConverter;

import net.sf.robocode.io.FileUtil;

import com.ga.robocode.RoboServer;
import com.ga.robocode.dto.Battle;
import com.ga.robocode.dto.EchoResponse;
import com.ga.robocode.dto.Result;

@Path("/engine")
public class EngineService {

	/*@GET
	@Path("/getEngines")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Engine> getEngines() {
		
		List<Engine> list = new ArrayList<Engine>();
		
		//GenericEntity<List<Engine>> entity = new GenericEntity<List<Engine>>(list) {};
		//Response myResponse = Response.ok(entity).build();
		
		return list;
		
	 }
	

	@GET
	@Path("/hola")
	@Produces(MediaType.APPLICATION_JSON)
	public String hola() {

		
		return "Hoola";
		
	 }*/
	
	@POST
	@Path("/start")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Result start(Battle battle) {
		System.out.println("Starting Robocode Engine");
		String fileFullName = FileUtil.getRobotsDir().getAbsolutePath()+"/"+battle.getJarName();
		File file = new File(fileFullName);
		if(file.exists()){
			file.delete();
		}
		FileOutputStream fw;
		try {
			fw = new FileOutputStream(file);
			fw.write(DatatypeConverter.parseBase64Binary(battle.getJarFile()));
	        fw.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Result result = RoboServer.startArena(battle.getRobots());
	
		return result;
		
	}
	
	@POST
	@Path("/echo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public EchoResponse echo() {
		System.out.println("Echo");
		EchoResponse response = new EchoResponse();
		response.setRc("00");
		return response;
		
	}
	
}
