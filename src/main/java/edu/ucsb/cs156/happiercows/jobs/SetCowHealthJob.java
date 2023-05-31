package edu.ucsb.cs156.happiercows.jobs;

import java.util.Optional;


import java.util.Iterator;
import edu.ucsb.cs156.happiercows.services.jobs.JobContext;
import edu.ucsb.cs156.happiercows.services.jobs.JobContextConsumer;
import edu.ucsb.cs156.happiercows.entities.Commons;
import edu.ucsb.cs156.happiercows.entities.UserCommons;
import edu.ucsb.cs156.happiercows.entities.CommonsPlus;
import edu.ucsb.cs156.happiercows.entities.User;
import edu.ucsb.cs156.happiercows.repositories.CommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserCommonsRepository;
import edu.ucsb.cs156.happiercows.repositories.UserRepository;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SetCowHealthJob implements JobContextConsumer {

    @Getter
    private CommonsRepository commonsRepository;
    @Getter
    private UserCommonsRepository userCommonsRepository;
    @Getter
    private UserRepository userRepository;

    private double newCowHealth;

    @Override
    public void accept(JobContext ctx) throws Exception {
        ctx.log("Updating cow health...");

        Iterable<Commons> allCommons = commonsRepository.findAll();

        for (Commons commons : allCommons) {
            ctx.log("Commons " + commons.getName() + ", degradationRate: " + commons.getDegradationRate() + ", carryingCapacity: " + commons.getCarryingCapacity());

            Iterable<UserCommons> allUserCommons = userCommonsRepository.findByCommonsId(commons.getId());

            for (UserCommons userCommons : allUserCommons) {
                User user = userRepository.findById(userCommons.getUserId()).orElseThrow(()->new RuntimeException("Error calling userRepository.findById(" + userCommons.getUserId() + ")"));
                ctx.log("User: " + user.getFullName() + ", numCows: " + userCommons.getNumOfCows() + ", cowHealth: " + userCommons.getCowHealth());

                ctx.log(" old cow health: " + userCommons.getCowHealth() + ", new cow health: " + newCowHealth);
                userCommons.setCowHealth(newCowHealth);
                userCommonsRepository.save(userCommons);
            }
        }

        ctx.log("Cow health has been updated!");
    }

}
