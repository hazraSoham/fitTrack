package com.soham.activityservice.repositories;

import com.soham.activityservice.models.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    Optional<List<Activity>> findByUserId(String userId);
}
