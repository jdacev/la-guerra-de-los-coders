package com.ga.robocode;

import java.net.InetAddress;
import java.util.ArrayList;

import javax.json.stream.JsonGenerator;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;

import net.sf.robocode.io.Logger;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.server.handler.IPAccessHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.component.LifeCycle;
import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.jsonp.JsonProcessingFeature;
import org.glassfish.jersey.server.ServerProperties;

import robocode.control.BattleSpecification;
import robocode.control.BattlefieldSpecification;
import robocode.control.RobocodeEngine;
import robocode.control.RobotResults;
import robocode.control.RobotSpecification;
import robocode.control.events.BattleAdaptor;
import robocode.control.events.BattleCompletedEvent;
import robocode.control.events.BattleErrorEvent;

import com.ga.robocode.dto.Result;
import com.ga.robocode.dto.RobotResult;

public class RoboServer extends Server{
	
	private int port;
	private String name;
	private String serverIp;
	private String serverPort;
	private static RobocodeEngine engine;
	private static RobotResults[] lastResults;

	public RoboServer(int port) {
		super(port);
		this.port = port;
		
        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() { 
               sendStopToWS();
             }
         });
	}

	public void startRoboServer(String name, String serverIp, String serverPort) throws Exception{

		this.name = name;
		this.serverIp = serverIp;
		this.serverPort = serverPort;
			
		ServletContextHandler context = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
		context.setContextPath("/");
		HandlerCollection handlerCollection = new ContextHandlerCollection();
		this.setHandler(handlerCollection);
        
        ServletHolder jerseyServlet = context.addServlet(org.glassfish.jersey.servlet.ServletContainer.class, "/*");
        jerseyServlet.setInitOrder(1);
        jerseyServlet.setInitParameter(ServerProperties.PROVIDER_PACKAGES, "com.ga.robocode.rest");
      
        IPAccessHandler ipHandler = new IPAccessHandler();
        ipHandler.addWhite(serverIp);
        
        context.setHandler(ipHandler);
                
        handlerCollection.addHandler(context);

        LifeCycle.Listener startedListener = new LifeCycleListener();
        this.addLifeCycleListener(startedListener);
        
        this.start();
        this.join();
		
	}
	
	public void connectWithWS() {
		Client client = ClientBuilder.newClient(new ClientConfig()
	        .register(JsonProcessingFeature.class)
	        .property(JsonGenerator.PRETTY_PRINTING, true)
		);
		
		System.out.println("Connecting with web server: http://"+serverIp+":"+serverPort);
		
		WebTarget target = client.target("http://"+serverIp+":"+serverPort).path("engine/register");
		
		try {
			Form form = new Form();
			form.param("nombre", name);
			form.param("ip", InetAddress.getLocalHost().getHostAddress());
			form.param("puerto", String.valueOf(port)); 
		
			String rc = target.request(MediaType.APPLICATION_JSON_TYPE)
		    .post(Entity.entity(form,MediaType.APPLICATION_FORM_URLENCODED_TYPE),
		        String.class);
			
			System.out.println("Register response code: " + rc);
			
			startRobocode();
			
		} catch (Exception e) {
			System.out.println("Error: " + e.getMessage());
			try {
				this.stop();
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}
	
	public void sendStopToWS() {
		Client client = ClientBuilder.newClient(new ClientConfig()
	        .register(JsonProcessingFeature.class)
	        .property(JsonGenerator.PRETTY_PRINTING, true)
		);
		
		System.out.println("Connecting with web server: http://"+serverIp+":"+serverPort);
		
		WebTarget target = client.target("http://"+serverIp+":"+serverPort).path("engine/stop");
		
		try {
			Form form = new Form();
			form.param("ip", InetAddress.getLocalHost().getHostAddress());
			form.param("puerto", String.valueOf(port)); 
		
			target.request(MediaType.APPLICATION_JSON_TYPE)
		    .post(Entity.entity(form,MediaType.APPLICATION_FORM_URLENCODED_TYPE),
		        String.class);

			
		} catch (Exception e) {
			System.out.println("Error: " + e.getMessage());
			try {
				this.stop();
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}

	private void startRobocode() {

		System.out.println("Starting Robocode Engine");
		if (engine == null) {
			engine = new RobocodeEngine();
			engine.addBattleListener(new BattleObserver());
			engine.setVisible(true);
		}
		
	}
	
	public static Result startArena(ArrayList<String> robots){
		BattlefieldSpecification field = new BattlefieldSpecification(800, 600);
		/*RobotSpecification[] robotSpecifications = new RobotSpecification[robots.size()];
		for(String robot : robots){
			RobotSpecification re = new RobotSpecification(Object fileSpecification, String name, String author, "", "", "", String jarFile, String fullClassName, "");
		}*/
		
		String robotsString = "";
		for(int i = 0; i < robots.size(); i++){
			if (i!=0)
				robotsString += ", ";
			robotsString += robots.get(i);
		}
		
		RobotSpecification[] robotList = engine.getLocalRepository(robotsString);
		
		lastResults = null;
		if (robotList.length > 0){
			BattleSpecification battle = new BattleSpecification(1, field,robotList);
			engine.runBattle(battle, true);
		}
				
		return getResults(lastResults);
	}
	
	private static Result getResults(RobotResults[] results){
		
		
		Result finalResult = new Result();
		
		if(results != null) {
			for (int i = 0; i < results.length; i++) {
				
				RobotSpecification bot = results[i].getRobot();
	
				String id = bot.getDescription();
				String name = bot.getClassName();
				String author = bot.getAuthorName();
				int score = results[i].getScore();
				int damage = results[i].getBulletDamage();
				
				RobotResult robotResult = new RobotResult();
				robotResult.setId(id);
				robotResult.setName(name);
				robotResult.setUser(author);
				robotResult.setScore(score);
				robotResult.setDamage(damage);
				
				finalResult.addRobotResult(robotResult);
	
	
			}
			RobotSpecification winnerBot = results[0].getRobot();
			finalResult.setWinner(winnerBot.getName());
		}
		
		return finalResult;
	}
	
	class BattleObserver extends BattleAdaptor {
		@Override
		public void onBattleError(final BattleErrorEvent event) {
			Logger.realErr.println(event.getError());
		}

		@Override
		public void onBattleCompleted(final BattleCompletedEvent event) {
			lastResults = RobotResults.convertResults(event.getSortedResults());
		}
	}

}
