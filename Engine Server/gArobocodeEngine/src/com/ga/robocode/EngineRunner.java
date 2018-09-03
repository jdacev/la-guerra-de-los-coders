package com.ga.robocode;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Properties;

public class EngineRunner {
	
	
	public static void main(String[] args) throws Exception {
		
		Properties props = new Properties();
		
		String propFileName = "engine.properties";
		if (args.length > 0) {
			propFileName = args[0];
		}
		
		int port = 8082;
		String name = null;
		String serverIp = null;
        String serverPort = null;
        
		try {
			System.out.println("Reading file properties: " + propFileName);
			FileInputStream fis = new FileInputStream(propFileName);
        
        	props.load(fis);
        	port = Integer.valueOf(props.getProperty("port"));
        	name = props.getProperty("name");
        	serverIp = props.getProperty("server.ip");
        	serverPort = props.getProperty("server.port");
        	
        } catch (FileNotFoundException e){
        	System.out.println("Error reading file properties, file doesn't exist: " + propFileName);
        	System.exit(-1);
        }
        
		RoboServer server = new RoboServer(port);
		server.startRoboServer(name, serverIp, serverPort);
		
    }

}
