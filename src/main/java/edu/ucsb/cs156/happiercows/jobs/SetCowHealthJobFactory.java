package edu.ucsb.cs156.happiercows.jobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ucsb.cs156.happiercows.entities.jobs.Job;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SetCowHealthJobFactory  {

    @Autowired 
    private CommonsRepository commonsRepository;
  
    @Autowired
    private UserCommonsRepository userCommonsRepository;

    @Autowired
    private UserRepository userRepository;

    public JobContextConsumer create(double newCowHealth) {
        log.info("commonsRepository = " + commonsRepository);
        log.info("userCommonsRepository = " + userCommonsRepository);
        log.info("newCowHealth = " + newCowHealth);
        return new SetCowHealthJob(commonsRepository, userCommonsRepository, userRepository, newCowHealth);
    }
}
