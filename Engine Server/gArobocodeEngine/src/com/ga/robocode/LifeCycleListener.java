package com.ga.robocode;

import org.eclipse.jetty.util.component.LifeCycle;

public class LifeCycleListener implements LifeCycle.Listener {

	@Override
	public void lifeCycleFailure(LifeCycle arg0, Throwable arg1) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void lifeCycleStarted(LifeCycle server) {
		System.out.println("Server Started");

		((RoboServer)server).connectWithWS();

	}

	@Override
	public void lifeCycleStarting(LifeCycle arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void lifeCycleStopped(LifeCycle server) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void lifeCycleStopping(LifeCycle arg0) {
		// TODO Auto-generated method stub
		
	}

	

}
